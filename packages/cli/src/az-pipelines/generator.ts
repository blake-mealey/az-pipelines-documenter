import yaml from 'js-yaml';
import {
  heading,
  table,
  code,
  yamlBlock,
  bold,
  italics,
  comment,
  codeBlock,
  indent,
  link,
} from './utils/markdown';
import { TemplateMetaData, GenerateOptions, Template } from './interfaces';
import {
  getParameterList,
  getTemplateType,
  requiredParameter,
} from './utils/templates';

function maybe(condition: any, value?: any, otherwise?: any) {
  if (condition) {
    const v = value === undefined ? condition : value;
    if (Array.isArray(v)) {
      return v;
    }
    return [v];
  } else if (otherwise !== undefined) {
    const v = otherwise;
    if (Array.isArray(v)) {
      return v;
    }
    return [v];
  } else {
    return [];
  }
}

function parameterMeta(meta: TemplateMetaData, parameterName: string) {
  return meta.parameters?.[parameterName];
}

function generateHeading(meta: TemplateMetaData, options: GenerateOptions) {
  return heading(meta.name, options.headingDepth);
}

function generateDeprecatedWarning(meta: TemplateMetaData) {
  return maybe(
    meta.deprecated,
    bold(
      italics(
        meta.deprecatedWarning
          ? `⚠ DEPRECATED: ${meta.deprecatedWarning} ⚠`
          : `⚠ DEPRECATED ⚠`
      )
    )
  );
}

function generateMetaData(template: Template, meta: TemplateMetaData) {
  const templateType = getTemplateType(template);

  return [
    [
      italics(`Source: ${link(`/${meta.filePath}`)}`),
      ...maybe(templateType, italics(`Template type: ${code(templateType)}`)),
      ...maybe(meta.version, italics(`Version: ${meta.version}`)),
    ].join('\n<br/>\n'),
  ];
}

function generateDescription(meta: TemplateMetaData) {
  return maybe(meta.description);
}

function generateUsage(
  template: Template,
  meta: TemplateMetaData,
  options: GenerateOptions
) {
  if (!meta.filePath) {
    return [];
  }

  const templateType = getTemplateType(template);

  if (!templateType) {
    return [];
  }

  let templatePath =
    meta.filePath + (meta.repo ? `@${meta.repo.identifier}` : '');

  const parameterList = getParameterList(template.parameters);

  const hasRequiredParam = parameterList?.some((param) =>
    requiredParameter(param)
  );
  const hasParams = false; // (parameterList?.length ?? 0) > 0;

  function insertTemplateGenerator(type: typeof templateType) {
    return codeBlock(
      'yaml',
      [
        `${type}:`,
        indent(2, `- template: ${templatePath}`),
        ...maybe(
          hasParams,
          hasRequiredParam
            ? indent(4, 'parameters:')
            : indent(4, '# parameters:')
        ),
        ...(parameterList?.map((param) => {
          if (requiredParameter(param)) {
            return indent(6, `${param.name}: ${param.type}`);
          } else {
            return indent(
              6,
              `# ${param.name}: ${yaml.dump(param.default).trim()}`
            );
          }
        }) ?? []),
      ].join('\n')
    );
  }

  let templateRepoUsage: string[] | undefined;
  if (meta.repo) {
    templateRepoUsage = [
      'Use template repository:',
      yamlBlock({
        resources: {
          repositories: [
            {
              repo: meta.repo.identifier,
              name: meta.repo.name,
              ref: meta.repo.ref,
              type: meta.repo.type,
            },
          ],
        },
      }),
    ];
  }

  return [
    heading('Example usage', options.headingDepth + 1),
    ...maybe(templateRepoUsage),
    'Insert template:',
    insertTemplateGenerator(templateType),
  ];
}

function generateParameters(
  template: Template,
  meta: TemplateMetaData,
  options: GenerateOptions
) {
  let parameterList = getParameterList(template.parameters);

  if (!parameterList) {
    return [];
  }

  function value(value: any) {
    return code(JSON.stringify(value));
  }

  return [
    heading('Parameters', options.headingDepth + 1),
    table([
      ['Parameter', 'Type', 'Default', 'Description'],
      ...parameterList.map((param) => {
        const paramMeta = param.name
          ? parameterMeta(meta, param.name)
          : undefined;
        const isRequired = requiredParameter(param);
        return [
          [
            maybe(param.name, code(param.name)),
            maybe(isRequired, bold('\\*')),
            maybe(param.displayName, '<br/>' + param.displayName),
          ].join(''),
          [
            maybe(param.type, code(param.type)),
            maybe(param.values, `(${param.values?.map(value)?.join(' \\| ')})`),
          ].join(' '),
          [maybe(isRequired, 'N/A', value(param.default))].join(' '),
          [maybe(paramMeta?.description, undefined, 'TODO')].join(' '),
        ];
      }),
    ]),
  ];
}

export function generate(
  data: string,
  meta: TemplateMetaData,
  options?: Partial<GenerateOptions>
) {
  const template = yaml.load(data) as Template;

  const fullOptions: GenerateOptions = {
    headingDepth: options?.headingDepth ?? 1,
  };

  const lines: (string | undefined)[] = [
    comment('this file was generated by pipelinedoc - do not modify directly'),
    generateHeading(meta, fullOptions),
    ...generateDeprecatedWarning(meta),
    ...generateMetaData(template, meta),
    ...generateDescription(meta),
    ...generateUsage(template, meta, fullOptions),
    ...generateParameters(template, meta, fullOptions),
  ];

  return lines.join('\n\n');
}

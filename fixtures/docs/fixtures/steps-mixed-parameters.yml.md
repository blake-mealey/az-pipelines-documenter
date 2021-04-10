<!-- this file was generated by pipelinedoc - do not modify directly -->

# steps-mixed-parameters

_Source: [/fixtures/steps-mixed-parameters.yml](/fixtures/steps-mixed-parameters.yml)_
<br/>
_Template type: `steps`_

## Example usage

Use template repository:

```yaml
resources:
  repositories:
    - repo: templates
      name: blake-mealey/pipelinedoc
      type: github
```

Insert template:

```yaml
steps:
  - template: fixtures/steps-mixed-parameters.yml@templates
    parameters:
      # condition: null
      # myParameter: my-string
      continue: boolean
      # details: {}
      # percentage: 100
      myStepParameter: step
      myStepListParameter: stepList
      myJobParameter: job
      myJobListParameter: jobList
      myDeploymentParameter: deployment
      myDeploymentListParameter: deploymentList
      myStageParameter: stage
      myStageListParameter: stageList
      fruit: string
      pointEstimate: number
```

## Parameters

|Parameter|Type|Default|Description|
|---|---|---|---|
|`condition`|`string` |`null`|TODO|
|`myParameter`|`string` |`"my-string"`|TODO|
|`continue`**\***|`boolean` |N/A|TODO|
|`details`|`object` |`{}`|TODO|
|`percentage`|`number` |`100`|TODO|
|`myStepParameter`**\***|`step` |N/A|TODO|
|`myStepListParameter`**\***|`stepList` |N/A|TODO|
|`myJobParameter`**\***|`job` |N/A|TODO|
|`myJobListParameter`**\***|`jobList` |N/A|TODO|
|`myDeploymentParameter`**\***|`deployment` |N/A|TODO|
|`myDeploymentListParameter`**\***|`deploymentList` |N/A|TODO|
|`myStageParameter`**\***|`stage` |N/A|TODO|
|`myStageListParameter`**\***|`stageList` |N/A|TODO|
|`fruit`**\***|`string` (`"apples"` \| `"oranges"` \| `"bananas"`)|N/A|TODO|
|`pointEstimate`**\***|`number` (`1` \| `3` \| `5` \| `8` \| `13`)|N/A|TODO|
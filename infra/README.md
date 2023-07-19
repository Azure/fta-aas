# Infrastructure installation guidance

Guidance destined to developers looking to quickly deploy the solution in their environments for testing purposes. This guidance expects that you are using the provided Codespaces.

> Please replace the values in < > with unique values for your deployment.

```
STORAGE_ACCOUNT=<ftaaastest>
APP_INSIGHTS_ACCOUNT=<ftaaastest>
RG_NAME=<ftaaastest>
LOCATION=westeurope

npm install
npm build --configuration production
az login --use-device-code
az group create --name $RG_NAME --location $LOCATION
az deployment group create --name ftaaas --template-file infra/deploytostorageaccount.bicep --parameters accountName=$STORAGE_ACCOUNT appInsightsName=$APP_INSIGHTS_ACCOUNT skuName=Standard_LRS -g $RG_NAME
az storage copy -s 'build/*' --destination-account-name $STORAGE_ACCOUNT --destination-container '$web' --recursive
echo "Website deployed: https://$(az deployment group show -g $RG_NAME --name ftaaas --query properties.outputs.staticWebsiteHostName.value -o tsv)"
```

## Bicep parameters

| Parameter Name | Type | Default Value | Possible Values | Description |
| :-- | :-- | :-- | :-- | :-- |
| `location` | string | `[resourceGroup().location]` |  | Optional. Location for all resources. |
| `accountName` | string |  |  | Optional. Name of the Storage Account. |
| `skuName` | string | `Standard_GRS` | `[Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS]` | Optional. Storage Account Sku Name. |
| `indexDocument` | string | 'index.html' |  | Optional. Name of default document for the website. |
| `errorDocument404Path` | string | 'error.html' |  | Optional. Name of default error document for the website. |
| `appInsightsName` | string |  |  | Optional. Name of the Application Insights Account. |

## Bicep Outputs

| Output Name | Type | Description |
| :-- | :-- | :-- |
| `scriptLogs` | string | The storage account static website configuration logs. |
| `staticWebsiteHostName` | string | The public website endpoint. |




/*
config
requestSchema,
responseSchema,
inputSchema,
outputSchema
*/

Ext.define('YZSoft.src.dialogs.CallWebServiceForToken', {
    extend: 'YZSoft.src.dialogs.CallWebService',
    defaultResponseSchema: {
        Response: {
            type: 'object',
            yzext: {
                isResponse: true
            },
            properties: {
                token: {
                    type: 'string'
                },
                expiresIn: {
                    type: 'integer'
                },
                expiresInMS: {
                    type: 'integer'
                },
                expiresDate: {
                    type: 'integer'
                }
            }
        }
    },
    generalPageTitle: RS.$('All_General'),
    inputMapPageTitle: RS.$('All_CallWebServiceForToken_inputMapPageTitle'),
    outputMapPageTitle: RS.$('All_CallWebServiceForToken_outputMapPageTitle'),
    exceptionPageTitle: RS.$('All_CallWebServiceForToken_exceptionPageTitle'),
    labelWsdl: RS.$('All_CallWebServiceForToken_labelWsdl'),
    requestTreeTitle: RS.$('All_CallWebServiceForToken_requestTreeTitle'),
    webServiceInputTreeTitle: RS.$('All_CallWebServiceForToken_webServiceInputTreeTitle'),
    webServiceOutputTreeTitle: RS.$('All_CallWebServiceForToken_webServiceOutputTreeTitle'),
    responseTreeTitle: RS.$('All_CallWebServiceForToken_responseTreeTitle')
});
/*
config
requestSchema,
responseSchema,
inputSchema,
outputSchema
*/

Ext.define('YZSoft.src.dialogs.CallRESTfulForToken', {
    extend: 'YZSoft.src.dialogs.CallRESTful',
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
    inputMapPageTitle: RS.$('All_CallRESTfulForToken_inputMapPageTitle'),
    outputMapPageTitle: RS.$('All_CallRESTfulForToken_outputMapPageTitle'),
    exceptionPageTitle: RS.$('All_CallRESTfulForToken_exceptionPageTitle'),
    labelUrl: RS.$('All_CallRESTfulForToken_labelUrl'),
    requestTreeTitle: RS.$('All_CallRESTfulForToken_requestTreeTitle'),
    RESTfulInputTreeTitle: RS.$('All_CallRESTfulForToken_RESTfulInputTreeTitle'),
    RESTfulOutputTreeTitle: RS.$('All_CallRESTfulForToken_RESTfulOutputTreeTitle'),
    responseTreeTitle: RS.$('All_CallRESTfulForToken_responseTreeTitle')
});
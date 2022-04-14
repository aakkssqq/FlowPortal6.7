
Ext.define('YZSoft.esb.sprites.DingTalk.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#5499c7'
            }
        }
    },
    sprites: {
        icon: {
            width: 32,
            height: 32
        }
    },
    properties: {
    },
    constProperties: {
        inputSchema: {
            text: {
                type: 'object',
                properties: {
                    touser: {
                        type: 'string'
                    },
                    toparty: {
                        type: 'string'
                    },
                    text: {
                        type: 'object',
                        properties: {
                            content: {
                                type: 'string'
                            }
                        }
                    }
                }
            },
            action_card: {
                type: 'object',
                properties: {
                    touser: {
                        type: 'string'
                    },
                    toparty: {
                        type: 'string'
                    },
                    totag: {
                        type: 'string'
                    },
                    action_card: {
                        type: 'object',
                        properties: {
                            title: {
                                type: 'string'
                            },
                            $body: {
                                type: 'string'
                            },
                            single_title: {
                                type: 'string'
                            },
                            single_url: {
                                type: 'string'
                            },
                            markdown: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        outputSchema: {
            Response: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    messageId: {
                        type: 'string'
                    },
                    invalidparty: {
                        type: 'string'
                    },
                    invaliduser: {
                        type: 'string'
                    }
                }
            }
        }
    }
});

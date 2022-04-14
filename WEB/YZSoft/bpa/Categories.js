
Ext.define('YZSoft.bpa.Categories', {
    singleton: true,
    extcatMap: {
        flow: ['FlowChart', 'General', 'BPMN', 'EVC', 'EPC', 'ORG', 'Product', 'Data', 'ITSystem', 'KPI', 'Risk', 'Regulation', 'Lane'],
        bpmn: ['BPMN', 'General', 'FlowChart', 'EVC', 'EPC', 'ORG', 'Product', 'Data', 'ITSystem', 'KPI', 'Risk', 'Regulation', 'Lane'],
        evc: ['EVC', 'General', 'FlowChart', 'BPMN', 'EPC', 'ORG', 'Product', 'Data', 'ITSystem', 'KPI', 'Risk', 'Regulation', 'Lane'],
        org: ['ORG', 'General'],
        prod: ['Product', 'General'],
        data: ['Data', 'General'],
        it: ['ITSystem', 'General'],
        kpi: ['KPI', 'General'],
        risk: ['Risk', 'General'],
        reg: ['Regulation', 'General']
    },
    all: ['General', 'FlowChart', 'BPMN', 'EVC', 'EPC', 'ORG', 'Product', 'Data', 'ITSystem', 'KPI', 'Risk', 'Regulation', 'Lane'],
    categoriesMap: {
        UML: {
            title: RS.$('BPA_UML'),
            items: [
                'UMLCommon',
                'UMLUseCase',
                'UMLSequence',
                'UMLClass',
                'UMLStateactivity',
                'UMLDeployment',
                'UMLComponent'
            ]
        }
    },
    categories: {
        Testing: {
            title: RS.$('BPA_Testing_Sprite'),
            shapes: {
                Start: {
                    sprite: {
                        xclass: 'YZSoft.bpm.src.flowchart.sprite.Activity',
                        text: RS.$('BPA_MgrApprove'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_MgrApprove')
                                }
                            }
                        }
                    }
                },
                UserTask: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.Task.UserTask',
                        text: RS.$('All_User'),
                        config: {
                            width: 28,
                            height: 20,
                            radius: 3,
                            sprites: {
                                icon: {
                                    x: 2,
                                    y: 2
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Task_User')
                                }
                            }
                        }
                    }
                },
                UserTask2: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.Task.UserTask',
                        text: RS.$('All_User'),
                        config: {
                            width: 28,
                            height: 20,
                            radius: 3,
                            sprites: {
                                icon: {
                                    x: 2,
                                    y: 2
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Task_User')
                                }
                            }
                        }
                    }
                },
                BoundaryEvent: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.BoundaryEvent',
                        text: RS.$('BPA_Boundary'),
                        config: {
                            width: 29,
                            height: 29
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Event_Boundary')
                                }
                            }
                        }
                    }
                },
                RoundRectangle: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.RoundRectangle',
                        text: RS.$('BPA_Sprite_RoundRectangle'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_RoundRectangle')
                                }
                            }
                        }
                    }
                },
                Braces: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Braces',
                        text: RS.$('BPA_Sprite_Braces'),
                        config: {
                            width: 28,
                            height: 25
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Braces')
                                }
                            }
                        }
                    }
                },
                Triangle: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Triangle',
                        text: RS.$('BPA_Sprite_Triangle'),
                        config: {
                            width: 28,
                            height: 24
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Triangle')
                                }
                            }
                        }
                    }
                },
                Package: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.UML.Common.Package',
                        text: RS.$('BPA_Sprite_Package'),
                        config: {
                            width: 26,
                            height: 22,
                            radius: 2,
                            headheight: 5
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Package')
                                }
                            },
                            sprites: {
                                bodyText: {
                                    text: RS.$('All_Property')
                                }
                            }
                        }
                    }
                },
                And: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.And',
                        text: RS.$('BPA_Sprite_And'),
                        config: {
                            width: 26,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_And')
                                }
                            }
                        }
                    }
                },
                VerticalPool: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.VerticalPool',
                        text: RS.$('BPA_Pool'),
                        config: {
                            width: 24,
                            height: 26,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'pool',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalPool')
                                }
                            }
                        }
                    }
                },
                VerticalLane: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.VerticalLane',
                        text: RS.$('BPA_Lane'),
                        config: {
                            width: 16,
                            height: 26,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'lane',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalLane')
                                }
                            }
                        }
                    }
                },
                HorizSeparator: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.HorizSeparator',
                        text: RS.$('BPA_Separator'),
                        config: {
                            width: 26,
                            height: 16
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_HorizSeparator')
                                }
                            }
                        }
                    }
                }
            }
        },
        General: {
            title: RS.$('BPA_GeneralSprite'),
            shapes: {
                Text: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Text',
                        text: RS.$('BPA_SpriteType_Text'),
                        config: {
                            width: 28,
                            height: 28,
                            sprites: {
                                text: {
                                    text: 'T',
                                    fontFamily: 'Georgia',
                                    fontSize: 38
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_SpriteType_Text')
                                }
                            }
                        }
                    }
                },
                Note: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Note',
                        text: RS.$('BPA_Sprite_Note'),
                        config: {
                            width: 24,
                            height: 30,
                            cap: 5
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Note')
                                }
                            }
                        }
                    }
                },
                Round: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Round',
                        text: RS.$('BPA_Sprite_Round'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Round')
                                }
                            }
                        }
                    }
                },
                Rectangle: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Rectangle',
                        text: RS.$('BPA_Sprite_Rectangle'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Rectangle')
                                }
                            }
                        }
                    }
                },
                RoundRectangle: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.RoundRectangle',
                        text: RS.$('BPA_Sprite_RoundRectangle'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_RoundRectangle')
                                }
                            }
                        }
                    }
                },
                Triangle: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Triangle',
                        text: RS.$('BPA_Sprite_Triangle'),
                        config: {
                            width: 28,
                            height: 24
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Triangle')
                                }
                            }
                        }
                    }
                },
                Diamond: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Diamond',
                        text: RS.$('BPA_Sprite_Diamond'),
                        config: {
                            width: 30,
                            height: 24
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Diamond')
                                }
                            }
                        }
                    }
                },
                Polygon: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Polygon',
                        text: RS.$('BPA_Sprite_Polygon'),
                        config: {
                            width: 28,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Polygon')
                                }
                            }
                        }
                    }
                },
                Hexagon: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Hexagon',
                        text: RS.$('BPA_Sprite_Hexagon'),
                        config: {
                            width: 28,
                            height: 22
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Hexagon')
                                }
                            }
                        }
                    }
                },
                Octagon: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Octagon',
                        text: RS.$('BPA_Sprite_Octagon'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Octagon')
                                }
                            }
                        }
                    }
                },
                Pentagon: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Pentagon',
                        text: RS.$('BPA_Sprite_Pentagon'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Pentagon')
                                }
                            }
                        }
                    }
                },
                Cross: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Cross',
                        text: RS.$('BPA_Sprite_Cross'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Cross')
                                }
                            }
                        }
                    }
                },
                Cloud: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Cloud',
                        text: RS.$('BPA_Sprite_Cloud'),
                        config: {
                            width: 28,
                            height: 22
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Cloud')
                                }
                            }
                        }
                    }
                },
                Braces: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Braces',
                        text: RS.$('BPA_Sprite_Braces'),
                        config: {
                            width: 28,
                            height: 25
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Braces')
                                }
                            }
                        }
                    }
                },
                Parentheses: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Parentheses',
                        text: RS.$('BPA_Sprite_Parentheses'),
                        config: {
                            width: 28,
                            height: 25
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Parentheses')
                                }
                            }
                        }
                    }
                },
                RightBrace: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.RightBrace',
                        text: RS.$('BPA_Sprite_RightBrace'),
                        config: {
                            width: 28,
                            height: 28,
                            translationX: 16
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_RightBrace')
                                }
                            }
                        }
                    }
                },
                LeftBrace: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.LeftBrace',
                        text: RS.$('BPA_Sprite_LeftBrace'),
                        config: {
                            width: 28,
                            height: 28,
                            translationX: -8
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_LeftBrace')
                                }
                            }
                        }
                    }
                },
                Apqc: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Apqc',
                        text: 'APQC',
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: 'APQC'
                                }
                            }
                        }
                    }
                },
                Teardrop: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Teardrop',
                        text: RS.$('BPA_Sprite_Teardrop'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Teardrop')
                                }
                            }
                        }
                    }
                },
                SingleLeftArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.SingleLeftArrow',
                        text: RS.$('BPA_Sprite_SingleLeftArrow'),
                        config: {
                            width: 28,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_SingleLeftArrow')
                                }
                            }
                        }
                    }
                },
                SingleRightArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.SingleRightArrow',
                        text: RS.$('BPA_Sprite_SingleRightArrow'),
                        config: {
                            width: 28,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_SingleRightArrow')
                                }
                            }
                        }
                    }
                },
                DoubleHorizontalArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.DoubleHorizontalArrow',
                        text: RS.$('BPA_Sprite_DoubleHorizontalArrow'),
                        config: {
                            width: 28,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_DoubleHorizontalArrow')
                                }
                            }
                        }
                    }
                },
                SingleUpArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.SingleUpArrow',
                        text: RS.$('BPA_Sprite_SingleUpArrow'),
                        config: {
                            width: 18,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_SingleUpArrow')
                                }
                            }
                        }
                    }
                },
                SingleDownArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.SingleDownArrow',
                        text: RS.$('BPA_Sprite_SingleDownArrow'),
                        config: {
                            width: 18,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_SingleDownArrow')
                                }
                            }
                        }
                    }
                },
                DoubleVerticalArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.DoubleVerticalArrow',
                        text: RS.$('BPA_Sprite_DoubleVerticalArrow'),
                        config: {
                            width: 18,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_DoubleVerticalArrow')
                                }
                            }
                        }
                    }
                },
                BackArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.BackArrow',
                        text: RS.$('BPA_Sprite_BackArrow'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_BackArrow')
                                }
                            }
                        }
                    }
                },
                RightBackArrow: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.RightBackArrow',
                        text: RS.$('BPA_Sprite_RightBackArrow'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_RightBackArrow')
                                }
                            }
                        }
                    }
                },
                Corner: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.General.Corner',
                        text: RS.$('BPA_Sprite_Corner'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Corner')
                                }
                            }
                        }
                    }
                }
            }
        },
        BPMN: {
            title: 'BPMN',
            shapes: {
                StartEvent: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.StartEvent.StartEvent',
                        text: RS.$('BPA_Sprite_StartEvent'),
                        config: {
                            width: 29,
                            height: 29
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_StartEvent')
                                }
                            }
                        }
                    }
                },
                IntermediateEvent: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.IntermediateEvent.IntermediateEvent',
                        text: RS.$('BPA_Sprite_IntermediateEvent'),
                        config: {
                            width: 29,
                            height: 29
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_IntermediateEvent')
                                }
                            }
                        }
                    }
                },
                BoundaryEvent: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.BoundaryEvent.BoundaryEvent',
                        text: RS.$('BPA_Event_Boundary'),
                        config: {
                            width: 29,
                            height: 29
                        },
                        drag: {
                            tagSurface: 'docker',
                            property: {
                                data: {
                                    Name: ''
                                }
                            }
                        }
                    }
                },
                EndEvent: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.EndEvent.EndEvent',
                        text: RS.$('BPA_Sprite_EndEvent'),
                        config: {
                            width: 29,
                            height: 29
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_EndEvent')
                                }
                            }
                        }
                    }
                },
                Task: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.Task.Task',
                        text: RS.$('BPA_Task_General'),
                        config: {
                            width: 32,
                            height: 24,
                            radius: 3
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Task_General')
                                }
                            }
                        }
                    }
                },
                Gateway: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.BPMN.Gateway.Gateway',
                        text: RS.$('BPA_Sprite_Gateway'),
                        config: {
                            width: 32,
                            height: 32
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Gateway')
                                }
                            }
                        }
                    }
                }
            }
        },
        FlowChart: {
            title: RS.$('BPA_FlowChart'),
            shapes: {
                Process: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Process',
                        text: RS.$('All_Process'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('All_Process')
                                }
                            }
                        }
                    }
                },
                Decision: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Decision',
                        text: RS.$('BPA_Sprite_Decision'),
                        config: {
                            width: 28,
                            height: 22
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Decision')
                                }
                            }
                        }
                    }
                },
                Terminator: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Terminator',
                        text: RS.$('BPA_Sprite_Terminator'),
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Terminator')
                                }
                            }
                        }
                    }
                },
                Document: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Document',
                        text: RS.$('BPA_Sprite_Document'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Document')
                                }
                            }
                        }
                    }
                },
                Data: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Data',
                        text: RS.$('KM_Form'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('KM_Form')
                                }
                            }
                        }
                    }
                },
                PredefinedProcess: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.PredefinedProcess',
                        text: RS.$('BPA_Sprite_PredefinedProcess'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_PredefinedProcess')
                                }
                            }
                        }
                    }
                },
                StoredData: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.StoredData',
                        text: RS.$('BPA_Sprite_StoredData'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_StoredData')
                                }
                            }
                        }
                    }
                },
                InternalStorage: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.InternalStorage',
                        text: RS.$('BPA_Sprite_InternalStorage'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_InternalStorage')
                                }
                            }
                        }
                    }
                },
                SequentialData: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.SequentialData',
                        text: RS.$('BPA_Sprite_SequentialData'),
                        config: {
                            width: 28,
                            height: 28
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_SequentialData')
                                }
                            }
                        }
                    }
                },
                DirectData: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.DirectData',
                        text: RS.$('BPA_Sprite_DirectData'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_DirectData')
                                }
                            }
                        }
                    }
                },
                ManualInput: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.ManualInput',
                        text: RS.$('BPA_Sprite_ManualInput'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ManualInput')
                                }
                            }
                        }
                    }
                },
                Card: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Card',
                        text: RS.$('BPA_Sprite_Card'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Card')
                                }
                            }
                        }
                    }
                },
                PaperTape: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.PaperTape',
                        text: RS.$('BPA_Sprite_PaperTape'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_PaperTape')
                                }
                            }
                        }
                    }
                },
                Display: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Display',
                        text: RS.$('BPA_Sprite_Display'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Display')
                                }
                            }
                        }
                    }
                },
                ManualOperation: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.ManualOperation',
                        text: RS.$('BPA_Sprite_ManualOperation'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ManualOperation')
                                }
                            }
                        }
                    }
                },
                Preparation: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Preparation',
                        text: RS.$('BPA_Sprite_Preparation'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Preparation')
                                }
                            }
                        }
                    }
                },
                ParallelMode: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.ParallelMode',
                        text: RS.$('BPA_Sprite_ParallelMode'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ParallelMode')
                                }
                            }
                        }
                    }
                },
                LoopLimit: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.LoopLimit',
                        text: RS.$('BPA_Sprite_LoopLimit'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_LoopLimit')
                                }
                            }
                        }
                    }
                },
                OnPageReference: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.OnPageReference',
                        text: RS.$('BPA_Sprite_OnPageReference'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_OnPageReference')
                                }
                            }
                        }
                    }
                },
                OffPageReference: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.OffPageReference',
                        text: RS.$('BPA_Sprite_OffPageReference'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_OffPageReference')
                                }
                            }
                        }
                    }
                },
                Annotation: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.FlowChart.Annotation',
                        text: RS.$('BPA_Sprite_Annotation'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_Annotation')
                                }
                            }
                        }
                    }
                }
            }
        },
        Lane: {
            title: RS.$('BPA_LanePool'),
            shapes: {
                VerticalPool: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.VerticalPool',
                        text: RS.$('BPA_Pool'),
                        config: {
                            width: 24,
                            height: 26,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'pool',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalPool')
                                }
                            }
                        }
                    }
                },
                VerticalLane: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.VerticalLane',
                        text: RS.$('BPA_Lane'),
                        config: {
                            width: 16,
                            height: 26,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'lane',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalLane')
                                }
                            }
                        }
                    }
                },
                HorizSeparator: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.HorizSeparator',
                        text: RS.$('BPA_Separator'),
                        config: {
                            width: 26,
                            height: 16
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalSeparator')
                                }
                            }
                        }
                    }
                },
                HorizPool: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.HorizPool',
                        text: RS.$('BPA_Pool'),
                        config: {
                            width: 26,
                            height: 22,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'pool',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_HorizPool')
                                }
                            }
                        }
                    }
                },
                HorizLane: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.HorizLane',
                        text: RS.$('BPA_Lane'),
                        config: {
                            width: 26,
                            height: 15,
                            titlesize: 6,
                            fillStyle: '#fff',
                            fillOpacity: 0.6
                        },
                        drag: {
                            tagSurface: 'lane',
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_HorizLane')
                                }
                            }
                        }
                    }
                },
                VerticalSeparator: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Lane.VerticalSeparator',
                        text: RS.$('BPA_Separator'),
                        config: {
                            width: 16,
                            height: 22
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_VerticalSeparator')
                                }
                            }
                        }
                    }
                }
            }
        },
        EVC: {
            title: RS.$('BPA_SpriteCat_EVC'),
            shapes: {
                ValueChain1: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain1',
                        text: RS.$('BPA_Sprite_ValueChain') + '1',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '1'
                                }
                            }
                        }
                    }
                },
                ValueChain2: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain2',
                        text: RS.$('BPA_Sprite_ValueChain') + '2',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '2'
                                }
                            }
                        }
                    }
                },
                ValueChain3: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain3',
                        text: RS.$('BPA_Sprite_ValueChain') + '3',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '3'
                                }
                            }
                        }
                    }
                },
                ValueChain4: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain4',
                        text: RS.$('BPA_Sprite_ValueChain') + '4',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '4'
                                }
                            }
                        }
                    }
                },
                ValueChain5: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain5',
                        text: RS.$('BPA_Sprite_ValueChain') + '5',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '5'
                                }
                            }
                        }
                    }
                },
                ValueChain6: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EVC.ValueChain6',
                        text: RS.$('BPA_Sprite_ValueChain') + '6',
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_ValueChain') + '6'
                                }
                            }
                        }
                    }
                }
            }
        },
        EPC: {
            title: RS.$('BPA_SpriteCat_EPC'),
            shapes: {
                Event: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Event',
                        text: RS.$('BPA_EPC_Event'),
                        config: {
                            width: 26,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Event')
                                }
                            }
                        }
                    }
                },
                Method: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Method',
                        text: RS.$('BPA_EPC_Method'),
                        config: {
                            width: 26,
                            height: 18,
                            radius: 3
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Method')
                                }
                            }
                        }
                    }
                },
                Procedure: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Procedure',
                        text: RS.$('BPA_EPC_Procedure'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Procedure')
                                }
                            }
                        }
                    }
                },
                EPCData: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.EPCData',
                        text: RS.$('KM_Form'),
                        config: {
                            width: 26,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('KM_Form')
                                }
                            }
                        }
                    }
                },
                Form: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Form',
                        text: RS.$('BPA_EPC_Form'),
                        config: {
                            width: 26,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Form')
                                }
                            }
                        }
                    }
                },
                Forms: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Forms',
                        text: RS.$('BPA_EPC_Forms'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Forms')
                                }
                            }
                        }
                    }
                },
                Database: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Database',
                        text: RS.$('BPA_Database'),
                        config: {
                            width: 26,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Database')
                                }
                            }
                        }
                    }
                },
                And: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.And',
                        text: RS.$('BPA_Sprite_And'),
                        config: {
                            width: 26,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Sprite_And')
                                }
                            }
                        }
                    }
                },
                Or: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Or',
                        text: RS.$('BPA_EPC_Or'),
                        config: {
                            width: 26,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Or')
                                }
                            }
                        }
                    }
                },
                Xor: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.EPC.Xor',
                        text: RS.$('BPA_EPC_Xor'),
                        config: {
                            width: 26,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_EPC_Xor')
                                }
                            }
                        }
                    }
                }
            }
        },
        ORG: {
            title: RS.$('BPA_SpriteCat_ORG'),
            shapes: {
                Organization: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ORG.OU',
                        text: RS.$('BPA_ORG_OU'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ORG_OU')
                                }
                            }
                        }
                    }
                },
                Position: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ORG.Position',
                        text: RS.$('BPA_ORG_Position'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ORG_Position')
                                }
                            }
                        }
                    }
                },
                Role: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ORG.Role',
                        text: RS.$('BPA_ORG_Role'),
                        config: {
                            width: 28,
                            height: 20,
                            sprites: {
                                line: {
                                    lineDash: [4, 4]
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ORG_Role')
                                }
                            }
                        }
                    }
                },
                Employee: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ORG.Employee',
                        text: RS.$('BPA_ORG_Employee'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ORG_Employee')
                                }
                            }
                        }
                    }
                }
            }
        },
        Product: {
            title: RS.$('BPA_SpriteCat_Product'),
            shapes: {
                Procuct: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Product.Product',
                        text: RS.$('BPA_Product_Product'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Product_Product')
                                }
                            }
                        }
                    }
                },
                Service: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Product.Service',
                        text: RS.$('BPA_Product_Service'),
                        config: {
                            width: 28,
                            height: 20,
                            sprites: {
                                line: {
                                    lineDash: [4, 4]
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Product_Service')
                                }
                            }
                        }
                    }
                },
                Target: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Product.Target',
                        text: RS.$('BPA_Product_Target'),
                        config: {
                            width: 26,
                            height: 26,
                            lineWidth: 1.5
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Product_Target')
                                }
                            }
                        }
                    }
                },
                Consumer: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Product.Consumer',
                        text: RS.$('BPA_Product_Consumer'),
                        config: {
                            width: 26,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Product_Consumer')
                                }
                            }
                        }
                    }
                }
            }
        },
        Data: {
            title: RS.$('BPA_SpriteCat_Data'),
            shapes: {
                Form: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Data.Form',
                        text: RS.$('BPA_Data_Form'),
                        config: {
                            width: 26,
                            height: 18
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Data_Form')
                                }
                            }
                        }
                    }
                },
                Forms: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Data.Forms',
                        text: RS.$('BPA_Data_Forms'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Data_Forms')
                                }
                            }
                        }
                    }
                }
            }
        },
        ITSystem: {
            title: RS.$('BPA_SpriteCat_ITSystem'),
            shapes: {
                Database: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ITSystem.Database',
                        text: RS.$('BPA_Database'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ITSystem_Database')
                                }
                            }
                        }
                    }
                },
                AppSystem: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ITSystem.AppSystem',
                        text: RS.$('BPA_ITSystem_AppSystem'),
                        config: {
                            width: 28,
                            height: 20,
                            gap: 1,
                            sprites: {
                                rect: {
                                    lineWidth: 2.5
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ITSystem_AppSystem')
                                }
                            }
                        }
                    }
                },
                Device: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ITSystem.Device',
                        text: RS.$('BPA_ITSystem_Device'),
                        config: {
                            width: 28,
                            height: 20,
                            gap: 1,
                            sprites: {
                                rect: {
                                    lineWidth: 2.5
                                }
                            }
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ITSystem_Device')
                                }
                            }
                        }
                    }
                },
                CloudServer: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.ITSystem.CloudServer',
                        text: RS.$('BPA_ITSystem_CloudServer'),
                        config: {
                            width: 28,
                            height: 20,
                            lineWidth: 2
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_ITSystem_CloudServer')
                                }
                            }
                        }
                    }
                }
            }
        },
        KPI: {
            title: RS.$('BPA_SpriteCat_KPI'),
            shapes: {
                KPI: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.KPI.KPI',
                        text: RS.$('BPA_KPI_KPI'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_KPI_KPI')
                                }
                            }
                        }
                    }
                }
            }
        },
        Risk: {
            title: RS.$('BPA_SpriteCat_Risk'),
            shapes: {
                Risk: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Risk.Risk',
                        text: RS.$('BPA_Risk_Risk'),
                        config: {
                            width: 30,
                            height: 30
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Risk_Risk')
                                }
                            }
                        }
                    }
                },
                Control: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Risk.Control',
                        text: RS.$('BPA_Risk_Control'),
                        config: {
                            width: 30,
                            height: 26
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Risk_Control')
                                }
                            }
                        }
                    }
                }
            }
        },
        Regulation: {
            title: RS.$('BPA_SpriteCat_Regulation'),
            shapes: {
                Risk: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Regulation.Regulation',
                        text: RS.$('BPA_Regulation_Regulation'),
                        config: {
                            width: 28,
                            height: 20
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Regulation_Regulation')
                                }
                            }
                        }
                    }
                },
                Item: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.Regulation.Item',
                        text: RS.$('BPA_Regulation_Item'),
                        config: {
                            width: 28,
                            height: 14
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_Regulation_Item')
                                }
                            }
                        }
                    }
                }
            }
        },
        UMLCommon: {
            title: RS.$('BPA_SpriteCat_UML'),
            shapes: {
                Package: {
                    sprite: {
                        xclass: 'YZSoft.bpa.sprite.UML.Common.Package',
                        text: RS.$('BPA_UML_Package'),
                        config: {
                            width: 26,
                            height: 22,
                            radius: 2,
                            headheight: 5
                        },
                        drag: {
                            property: {
                                data: {
                                    Name: RS.$('BPA_UML_Package')
                                }
                            },
                            sprites: {
                                bodyText: {
                                    text: RS.$('All_Property')
                                }
                            }
                        }
                    }
                }
            }
        },
        UMLUseCase: {
            title: RS.$('BPA_UML_UseCase'),
            shapes: {
            }
        },
        UMLSequence: {
            title: RS.$('BPA_UML_Sequence'),
            shapes: {
            }
        },
        UMLClass: {
            title: RS.$('BPA_UML_Class'),
            shapes: {
            }
        },
        UMLStateactivity: {
            title: RS.$('BPA_UML_Stateactivity'),
            shapes: {
            }
        },
        UMLDeployment: {
            title: RS.$('BPA_UML_Deployment'),
            shapes: {
            }
        },
        UMLComponent: {
            title: RS.$('BPA_UML_Component'),
            shapes: {
            }
        }
    },

    getCategoriesFromExt: function (fileext) {
        var me = this,
            fileext = (fileext || '').toLowerCase(),
            fileext = Ext.String.startsWith(fileext, '.') ? fileext.substr(1) : fileext;

        return me.extcatMap[fileext] || me.all;
    },

    getCategories: function (catenames) {
        var me = this,
            catsMaped = [],
            rv = {};

        Ext.each(catenames, function (catname) {
            if (me.categoriesMap[catname])
                catsMaped = Ext.Array.union(catsMaped, me.categoriesMap[catname].items);
            else
                catsMaped.push(catname);
        });

        Ext.each(catsMaped, function (catname) {
            if (me.categories[catname])
                rv[catname] = me.categories[catname];
        });

        return rv;
    },

    getCategoriesTree: function (catenames, level) {
        var me = this,
            catsMaped = [],
            rv = [];

        level = level || 1;
        Ext.each(catenames, function (catname) {
            if (me.categoriesMap[catname]) {
                rv.push({
                    category: catname,
                    text: me.categoriesMap[catname].title,
                    expandable: true,
                    expanded: true,
                    checked: false,
                    children: me.getCategoriesTree(me.categoriesMap[catname].items, level + 1)
                });
            }
            else {
                rv.push({
                    category: catname,
                    text: me.categories[catname].title,
                    expandable: false,
                    expanded: true,
                    checked: false
                });
            }
        });

        return rv;
    }
});
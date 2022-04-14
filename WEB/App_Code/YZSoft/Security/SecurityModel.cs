using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
///dWaterWellKnowPermision 的摘要说明

/// </summary>
public enum SecurityModel
{
    RBAC, //RBAC权限模型
    Role,  //角色权限模型（例如：流程小组权限模型）
    Empty
}

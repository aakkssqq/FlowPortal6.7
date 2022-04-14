using System;
using System.Collections.Generic;
using System.Web;
using System.Data;

/// <summary>
///YZComunity 的摘要说明
/// </summary>
namespace YZSoft
{
    public enum YZResourceType
    {
        Task = 1,
        BPAFile = 2,
        Group = 3,
        Process = 4,
        TaskApproved = 5,
        TaskRejected = 6,
        ProcessRemind = 7,
        SingleChat = 8,
        AdministratorNotification = 9
    }
}
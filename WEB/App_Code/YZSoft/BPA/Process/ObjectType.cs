using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using YZSoft.Web.DAL;
using BPM;

namespace YZSoft.Web.BPA
{
    public enum ObjectType
    {
        Function,
        Activity,
        Event,
        Form,
        Forms,
        AppSystem,
        CloudServer,
        Database,
        Device,
        Consumer,
        Product,
        Service,
        Target,
        Employee,
        KPI,
        OU,
        Position,
        Regulation,
        RegulationItem,
        Risk,
        Role
    }
}
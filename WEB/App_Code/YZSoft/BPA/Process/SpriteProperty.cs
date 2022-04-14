using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class SpriteProperty : YZObject
    {
        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string Remark { get; set; }

        [DataMember,JsonConverter(typeof(StringEnumConverter))]
        public ObjectType SpriteType { get; set; }

        [DataMember]
        public string Code { get; set; }

        [DataMember]
        public string Order { get; set; }

        private ReferenceCollection _responsible;
        private ReferenceCollection _accountable;
        private ReferenceCollection _consulted;
        private ReferenceCollection _informed;
        private ReferenceCollection _regulation;
        private ReferenceCollection _risk;
        private ReferenceCollection _controlPoint;
        private ReferenceCollection _kpi;
        private ReferenceCollection _form;
        private ReferenceCollection _itSystem;

        [DataMember]
        public ReferenceCollection Responsible
        {
            get
            {
                if (this._responsible == null)
                    this._responsible = new ReferenceCollection();

                return this._responsible;
            }
            set
            {
                this._responsible = value;
            }
        }

        [DataMember]
        public ReferenceCollection Accountable
        {
            get
            {
                if (this._accountable == null)
                    this._accountable = new ReferenceCollection();

                return this._accountable;
            }
            set
            {
                this._accountable = value;
            }
        }

        [DataMember]
        public ReferenceCollection Consulted
        {
            get
            {
                if (this._consulted == null)
                    this._consulted = new ReferenceCollection();

                return this._consulted;
            }
            set
            {
                this._consulted = value;
            }
        }

        [DataMember]
        public ReferenceCollection Informed
        {
            get
            {
                if (this._informed == null)
                    this._informed = new ReferenceCollection();

                return this._informed;
            }
            set
            {
                this._informed = value;
            }
        }

        [DataMember]
        public ReferenceCollection Regulation
        {
            get
            {
                if (this._regulation == null)
                    this._regulation = new ReferenceCollection();

                return this._regulation;
            }
            set
            {
                this._regulation = value;
            }
        }

        [DataMember]
        public ReferenceCollection Risk
        {
            get
            {
                if (this._risk == null)
                    this._risk = new ReferenceCollection();

                return this._risk;
            }
            set
            {
                this._risk = value;
            }
        }

        [DataMember]
        public ReferenceCollection ControlPoint
        {
            get
            {
                if (this._controlPoint == null)
                    this._controlPoint = new ReferenceCollection();

                return this._controlPoint;
            }
            set
            {
                this._controlPoint = value;
            }
        }

        [DataMember]
        public ReferenceCollection KPI
        {
            get
            {
                if (this._kpi == null)
                    this._kpi = new ReferenceCollection();

                return this._kpi;
            }
            set
            {
                this._kpi = value;
            }
        }

        [DataMember]
        public ReferenceCollection Form
        {
            get
            {
                if (this._form == null)
                    this._form = new ReferenceCollection();

                return this._form;
            }
            set
            {
                this._form = value;
            }
        }

        [DataMember]
        public ReferenceCollection ITSystem
        {
            get
            {
                if (this._itSystem == null)
                    this._itSystem = new ReferenceCollection();

                return this._itSystem;
            }
            set
            {
                this._itSystem = value;
            }
        }
    }
}
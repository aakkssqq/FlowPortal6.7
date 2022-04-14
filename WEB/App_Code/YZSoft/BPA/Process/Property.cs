using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using BPM;
using BPM.Client;

namespace YZSoft.Web.BPA
{
    [DataContract]
    public class Property : YZObject
    {
        [DataMember]
        public string Code { get; set; }
        [DataMember]
        public string Order { get; set; }
        [DataMember]
        public string Version { get; set; }
        [DataMember]
        public DateTime CreateAt { get; set; }
        [DataMember]
        public string Creator { get; set; }
        [DataMember]
        public DateTime LastChange { get; set; }
        [DataMember]
        public string ChangeBy { get; set; }

        [DataMember, JsonConverter(typeof(DateTimeConverter))]
        public DateTime ReleaseDate { get; set; }
        [DataMember, JsonConverter(typeof(DateTimeConverter))]
        public DateTime AuditDate { get; set; }
        [DataMember, JsonConverter(typeof(DateTimeConverter))]
        public DateTime ApproveDate { get; set; }

        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public Milestone Milestone { get; set; }

        [DataMember,JsonConverter(typeof(DateTimeConverter))]
        public DateTime Since { get; set; }

        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public FileColor Color { get; set; }

        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public ExecuteStatus ExecuteStatus { get; set; }

        [DataMember, JsonConverter(typeof(StringEnumConverter))]
        public EvcProcessType EvcProcessType { get; set; }

        [DataMember]
        public string Purpose { get; set; }
        [DataMember]
        public string Scope { get; set; }
        [DataMember]
        public string Definition { get; set; }
        [DataMember]
        public string Responsibility { get; set; }
        [DataMember]
        public string DispatchScope { get; set; }
        [DataMember]
        public string DesignPurpose { get; set; }

        private ReferenceCollection _owner = null;
        private ReferenceCollection _auditor = null;
        private ReferenceCollection _approval = null;
        private User _creator = null;
        private User _changeby = null;

        public Property()
        {
            this.Milestone = Milestone.Planning;
            this.Color = FileColor.White;
            this.ExecuteStatus = ExecuteStatus.NoExecute;
            this.EvcProcessType = EvcProcessType.StrategicProcess;
        }

        [DataMember]
        public ReferenceCollection Owner
        {
            get
            {
                if (this._owner == null)
                    this._owner = new ReferenceCollection();

                return this._owner;
            }
            set
            {
                this._owner = value;
            }
        }

        [DataMember]
        public ReferenceCollection Auditor
        {
            get
            {
                if (this._auditor == null)
                    this._auditor = new ReferenceCollection();

                return this._auditor;
            }
            set
            {
                this._auditor = value;
            }
        }

        [DataMember]
        public ReferenceCollection Approval
        {
            get
            {
                if (this._approval == null)
                    this._approval = new ReferenceCollection();

                return this._approval;
            }
            set
            {
                this._approval = value;
            }
        }
        
        public User CreatorUser
        {
            get
            {
                if (this._creator == null)
                    this._creator = this.GetUser(this.Creator);
                return this._creator;
            }
        }

        public User ChangeByUser
        {
            get
            {
                if (this._changeby == null)
                    this._changeby = this.GetUser(this.ChangeBy);
                return this._changeby;
            }
        }

        private User GetUser(string account)
        {
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                User user = null;
                if (!String.IsNullOrEmpty(account))
                {
                    user = User.TryGetUser(cn, account);
                }

                if (user == null)
                {
                    user = new User();
                    user.Account = account;
                }

                return user;
            }
        }
    }
}
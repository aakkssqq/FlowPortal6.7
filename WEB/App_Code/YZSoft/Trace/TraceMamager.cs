using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

/// <summary>
///Employee 的摘要说明
/// </summary>
///
namespace YZSoft.Web.Trace
{
    public class TraceManager
    {
        public static BPMStepCollection BuildDependency(BPMConnection cn, BPMStepCollection steps)
        {
            for (int i = 0; i < steps.Count; i++)
            {
                BPMProcStep step = steps[i];

                if (NameCompare.EquName(step.SelAction, SystemAction.Inform) ||
                    NameCompare.EquName(step.SelAction, SystemAction.InviteIndicate) || 
                    NameCompare.EquName(step.SelAction, SystemAction.RecedeBack) ||
                    NameCompare.EquName(step.SelAction, SystemAction.AssignOwner) ||
                    NameCompare.EquName(step.SelAction, SystemAction.ReActive) ||
                    NameCompare.EquName(step.SelAction, SystemAction.Jump) ||
                    NameCompare.EquName(step.SelAction, SystemAction.TimeoutJump) ||
                    NameCompare.EquName(step.SelAction, SystemAction.Transfer) ||
                    NameCompare.EquName(step.SelAction, SystemAction.Handover))
                {
                    step.TraceNextSteps = step.LoadNextSteps(cn);
                }

                if (NameCompare.EquName(step.SelAction, SystemAction.PickBackRestart) ||
                    NameCompare.EquName(step.SelAction, SystemAction.PickBack))
                {
                    BPMStepCollection optSteps = step.LoadNextSteps(cn);
                    if(optSteps.Count >= 1)
                        step.TraceNextSteps = optSteps[0].LoadNextSteps(cn);
                }

                if(step.RisedConsignID != -1)
                {
                    step.ConsignUsers = BPMProcStep.GetConsignUsers(cn, step.RisedConsignID);
                }
            }

            return InternalBuildDependency(cn, steps);
        }

        public static BPMProcStep TryGetConsignParent(BPMStepCollection steps,BPMProcStep consignStep)
        {
            foreach (BPMProcStep step in steps)
            {
                if (consignStep.BelongConsignID == step.RisedConsignID)
                    return step;

                foreach (BPMProcStep step1 in step.ConsignSteps)
                {
                    if (consignStep.BelongConsignID == step1.RisedConsignID)
                        return step;
                }
            }

            return null;
        }

        public static BPMProcStep TryGetConsignOwnerStep(BPMStepCollection steps, int consignid)
        {
            foreach (BPMProcStep step in steps)
            {
                if (consignid == step.RisedConsignID)
                    return step;
            }

            return null;
        }

        public static BPMProcStep TryGetPrevStep(BPMStepCollection steps, int stepid)
        {
            foreach (BPMProcStep step in steps)
            {
                if(step.TraceNextSteps.TryGetItem(stepid) != null)
                    return step;
            }

            return null;
        }

        internal static BPMStepCollection InternalBuildDependency(BPMConnection cn, BPMStepCollection steps)
        {
            BPMStepCollection allsteps = new BPMStepCollection();
            allsteps.AddRange(steps);

            for (int i = 0; i < steps.Count; i++)
            {
                BPMProcStep step = steps[i];

                //加签
                if (step.IsConsignStep)
                {
                    BPMProcStep parentStep = TryGetConsignParent(steps, step);
                    if (parentStep != null)
                    {
                        parentStep.ConsignSteps.Add(step);
                        steps.RemoveAt(i);
                        i--;
                    }
                }
                else if (step.RisedConsignID != -1) //加签完成后回到的原步骤，其RisedConsignID和原来步骤相同
                {
                    BPMProcStep consignOwnerStep = TryGetConsignOwnerStep(allsteps, step.RisedConsignID);
                    if (consignOwnerStep != null)
                    {
                        if (!Object.ReferenceEquals(step, consignOwnerStep))
                        {
                            consignOwnerStep.ConsignSteps.Add(step);
                            steps.RemoveAt(i);
                            i--;
                        }
                    }
                }

                //识别RisedConsignID!=-1的步骤是不是加签主步骤，如果不是主步骤设置RisedConsignID为-1
                if (step.RisedConsignID != -1)
                {
                    BPMProcStep consignOwnerStep = TryGetConsignOwnerStep(allsteps, step.RisedConsignID);
                    if (consignOwnerStep != null)
                    {
                        if (!Object.ReferenceEquals(step, consignOwnerStep))
                            step.RisedConsignID = -1; //不是主步骤识别标志
                    }
                }

                //获得所有步骤的TracePrevSteps
                BPMProcStep prevStep = TryGetPrevStep(allsteps, step.StepID);
                if(prevStep != null)
                {
                    step.TracePrevSteps.Add(prevStep);
                }
            }

            //知会(由任务操作发起)
            List<BPMProcStep> taskoptInformSteps = new List<BPMProcStep>();
            foreach(BPMProcStep step in steps)
            {
                if (step.IsTaskOptStep && NameCompare.EquName(step.SelAction, SystemAction.Inform)) //发起知会的任务操作节点
                    taskoptInformSteps.Add(step);
            }

            foreach(BPMProcStep taskoptInformStep in taskoptInformSteps)
            {
                foreach (BPMProcStep informstep1 in taskoptInformStep.TraceNextSteps)
                {
                    BPMProcStep informStep = steps.TryGetItem(informstep1.StepID);
                    if (informStep != null)
                    {
                        taskoptInformStep.InformSteps.Add(informStep);
                        steps.Remove(informStep);
                    }
                }
            }

            //阅示(由任务操作发起)
            List<BPMProcStep> taskoptIndicateSteps = new List<BPMProcStep>();
            foreach (BPMProcStep step in steps)
            {
                if (step.IsTaskOptStep && NameCompare.EquName(step.SelAction, SystemAction.InviteIndicate)) //发起阅示的任务操作节点
                    taskoptIndicateSteps.Add(step);
            }

            foreach (BPMProcStep taskoptIndicateStep in taskoptIndicateSteps)
            {
                foreach (BPMProcStep informstep1 in taskoptIndicateStep.TraceNextSteps)
                {
                    BPMProcStep informStep = steps.TryGetItem(informstep1.StepID);
                    if (informStep != null)
                    {
                        taskoptIndicateStep.IndicateSteps.Add(informStep);
                        steps.Remove(informStep);
                    }
                }
            }

            //合并流程中知会节点的实例
            for (int i = 0 ; i < steps.Count; i++)
            {
                BPMProcStep mainStep = steps[i];
                if (mainStep.IsInformStep) //第一个知会节点
                {
                    BPMStepCollection mainStepPrev = mainStep.TracePrevSteps = mainStep.LoadPrevSteps(cn);
                    if (mainStepPrev.Count < 1 || mainStepPrev[0].StepID == -1)
                        continue;
        
                    for (int j = i+1; j < steps.Count; j++)
                    {
                        BPMProcStep step = steps[j];

                        if (!step.IsInformStep)
                            continue;

                        BPMStepCollection stepPrev = step.LoadPrevSteps(cn);

                        if (stepPrev.Count < 1 || stepPrev[0].StepID == -1)
                            continue;

                        if (stepPrev[0].StepID == mainStepPrev[0].StepID)
                        {
                            mainStep.InformSteps.Add(step);
                            steps.RemoveAt(j);
                            j--;
                        }
                    }
                }
            }

            //合并流程中知会节点的实例（阅示类型）
            for (int i = 0; i < steps.Count; i++)
            {
                BPMProcStep mainStep = steps[i];
                if (mainStep.IsIndicateStep) //第一个知会节点
                {
                    BPMStepCollection mainStepPrev = mainStep.TracePrevSteps = mainStep.LoadPrevSteps(cn);
                    if (mainStepPrev.Count < 1 || mainStepPrev[0].StepID == -1)
                        continue;

                    for (int j = i + 1; j < steps.Count; j++)
                    {
                        BPMProcStep step = steps[j];

                        if (!step.IsIndicateStep)
                            continue;

                        BPMStepCollection stepPrev = step.LoadPrevSteps(cn);

                        if (stepPrev.Count < 1 || stepPrev[0].StepID == -1)
                            continue;

                        if (stepPrev[0].StepID == mainStepPrev[0].StepID)
                        {
                            mainStep.IndicateSteps.Add(step);
                            steps.RemoveAt(j);
                            j--;
                        }
                    }
                }
            }

            //知会节点生成的知会实例，其顺序跑到新生成审批节点的后面去了
            BPMStepCollection rv = new BPMStepCollection();
            rv.AddRange(steps.OrderBy(a => ((a.IsInformStep || a.IsIndicateStep) && a.TracePrevSteps.Count >= 1) ? a.TracePrevSteps[0].StepID:a.StepID));
            return rv;
        }
    }
}
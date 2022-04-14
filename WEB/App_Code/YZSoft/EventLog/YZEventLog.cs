using System;
using System.Data;
using System.Configuration;
using System.Diagnostics;
using BPM;
using BPM.Resources;

/// <summary>
/// YZEnevtLog 的摘要说明

/// </summary>
public class YZEventLog : EventLog
{
    private static string EventLogName = null;
    private static string EventSourceName = null;

    static YZEventLog()
    {
        UIStrings rs = new UIStrings();
        YZEventLog.EventLogName = rs.TryGet("EventLog.Log");
        YZEventLog.EventSourceName = rs.TryGet("EventLog.Source.BPM");

        if (String.IsNullOrEmpty(YZEventLog.EventLogName))
            YZEventLog.EventLogName = "YZSoft";

        if (String.IsNullOrEmpty(YZEventLog.EventSourceName))
            YZEventLog.EventSourceName = "BPM";
    }

    public YZEventLog()
    {
        if (!EventLog.SourceExists(YZEventLog.EventSourceName))
        {
            EventLog.CreateEventSource(YZEventLog.EventSourceName, YZEventLog.EventLogName);
        }
        else
        {
            string logName = EventLog.LogNameFromSourceName(YZEventLog.EventSourceName, ".");
            if (logName != YZEventLog.EventLogName)
            {
                EventLog.DeleteEventSource(YZEventLog.EventSourceName);
                EventLog.CreateEventSource(YZEventLog.EventSourceName, YZEventLog.EventLogName);
            }
        }

        this.Source = YZEventLog.EventSourceName;
    }

    public void WriteEntry(Exception e)
    {
        try
        {
            EventLogEntryType type = EventLogEntryType.Error;
            int eventId = (int)BPMExceptionType.UserException;

            BPMException bpmExp = e as BPMException;
            if (bpmExp != null)
            {
                type = bpmExp.LogType;
                eventId = (int)bpmExp.ExceptionType;
            }

            this.WriteEntry(TrimEventMessage(e.Message), type, eventId);
        }
        catch (Exception exp)
        {
            try
            {
                //日志满
                EventLog.Delete(YZEventLog.EventLogName);

                this.WriteEntry(new BPMException(BPMExceptionType.EventLogReset, exp.Message));
                this.WriteEntry(e);
            }
            catch
            {
            }
        }
    }

    private string TrimEventMessage(string message)
    {
        if (String.IsNullOrEmpty(message))
            return String.Empty;

        if (message.Length <= 4096)
            return message;

        return (message.Substring(0, 4096) + "...");
    }
}

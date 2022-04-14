using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Specialized;
using BPM.Client.Data.Common;

/// <summary>
///Class1 的摘要说明
/// </summary>
public class YZSqlClientParameterParser
{
    private static bool IsValidParamNameChar(char c, char perfix)
    {
        if ((!char.IsLetterOrDigit(c) && (c != perfix)) && ((c != '$') && (c != '#')))
        {
            return (c == '_');
        }
        return true;
    }

    public static StringCollection ParseCommandText(string commandText, string perfix)
    {
        int num = 0;
        int length = commandText.Length;
        State inText = State.InText;
        char cPerfix = '@';

        if (!String.IsNullOrEmpty(perfix))
            cPerfix = perfix[0];

        StringCollection strings = new StringCollection();
        while (num < length)
        {
            string str;
            switch (inText)
            {
                case State.InText:
                    {
                        if (commandText[num] != '\'')
                        {
                            break;
                        }
                        inText = State.InQuote;
                        continue;
                    }
                case State.InQuote:
                    num++;
                    goto Label_009B;

                case State.InDoubleQuote:
                    num++;
                    goto Label_00BF;

                case State.InBracket:
                    num++;
                    goto Label_00E3;

                case State.InCode:
                    num++;
                    goto Label_00E4;

                case State.InParameter:
                    num++;
                    str = string.Empty;
                    goto Label_0120;

                default:
                    {
                        continue;
                    }
            }
            if (commandText[num] == '"')
            {
                inText = State.InDoubleQuote;
            }
            else if (commandText[num] == '[')
            {
                inText = State.InBracket;
            }
            else if (num + 1 < length && commandText[num] == '<' && commandText[num + 1] == '%')
            {
                inText = State.InCode;
            }
            else if (commandText[num] == cPerfix)
            {
                inText = State.InParameter;
            }
            else
            {
                num++;
            }
            continue;
        Label_0097:
            num++;
        Label_009B:
            if ((num < length) && (commandText[num] != '\''))
            {
                goto Label_0097;
            }
            num++;
            inText = State.InText;
            continue;
        Label_00BB:
            num++;
        Label_00BF:
            if ((num < length) && (commandText[num] != '"'))
            {
                goto Label_00BB;
            }
            num++;
            inText = State.InText;
            continue;
        Label_00BC:
            num++;
        Label_00E4:
            if ((num + 1 < length) && (commandText[num] != '%' || commandText[num + 1] != '>'))
            {
                goto Label_00BC;
            }
            num++;
            inText = State.InText;
            continue;
        Label_00DF:
            num++;
        Label_00E3:
            if ((num < length) && (commandText[num] != ']'))
            {
                goto Label_00DF;
            }
            num++;
            inText = State.InText;
            continue;
        Label_0107:
            str = str + commandText[num];
            num++;
        Label_0120:
            if ((num < length) && IsValidParamNameChar(commandText[num], cPerfix))
            {
                goto Label_0107;
            }
            if (!str.StartsWith(perfix, StringComparison.Ordinal))
            {
                str = perfix + str;//Add by martin
                if (!strings.Contains(str))
                    strings.Add(str);
            }
            inText = State.InText;
        }
        return strings;
    }

    // Nested Types
    private enum State
    {
        InText,
        InQuote,
        InDoubleQuote,
        InBracket,
        InParameter,
        InCode
    }
}

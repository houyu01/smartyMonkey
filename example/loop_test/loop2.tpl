{%foreach from=$loop1 key=key item=value name=loop1%}
    <div>key is: {%$key%}</div>
    <div>val is: {%$value%}</div>
    <div>index is: {%$smarty.foreach.loop1.index%}</div>
{%/foreach%}

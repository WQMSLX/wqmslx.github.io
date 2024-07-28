import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as l,c as n,b as s,d as e,w as t,e as h,o as p,f as k}from"./app-CGKIFyad.js";const r={},d=s("hr",null,null,-1),c=s("p",null,"title: 记录一次sql线上sql优化问题 index: true icon: laptop-code category:",-1),A=s("ul",null,[s("li",null,"sql")],-1),o=s("hr",null,null,-1),g={class:"table-of-contents"},y=h(`<h3 id="_1-本次老代码线上问题sql" tabindex="-1"><a class="header-anchor" href="#_1-本次老代码线上问题sql"><span>1. 本次老代码线上问题sql：</span></a></h3><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">-- </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> * </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user </span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">where</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;2022-01-01&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">and</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;2024-06-27&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">order by</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">desc</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">limit</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1500000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要出现问题的地方在范围查询上，由于数据量比较大，且范围查询导致索引失效。 经过分析，这条sql是先从数据库把数据从数据库查出后再拿到服务层排序。这个分数据库目前数据量为100万。考虑到数据库量比较大对sql进行如下优化：</p><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> * </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">inner join</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">where</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;2022-01-01&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">and</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;2024-06-27&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">limit</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1500000</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) tmp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">using</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(id)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">order by</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">desc</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经过测试，速度确实快了一些。但是考虑到排序对服务层的压力还是比较大，将排序放到子查询中：</p><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> * </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">inner join</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">select</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> user</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">where</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&gt;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;2022-01-01&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">and</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> create_time </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;2024-06-27&#39;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">order by</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> id </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">desc</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">limit</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1500000</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) tmp </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">using</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(id);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>总结：</p><ol><li>实际测试，在不同数据量下这几种sql执行效果不同，在数据量较大时应尽量在存储引擎曾通过索引覆盖降低回表和优化排序，去优化sql，具体问题具体分析。</li><li>在设计时就应该考虑了业务功能的合理性，避免不合理的业务需求。尽量像这种批量任务可以使用定时任务在低峰期定期执行。</li><li>这种数据量比较大但是对一致性要求不高的业务可以考虑用从库慢慢执行。就算挂了也不影响核心链路。</li><li>也可以上es.</li></ol>`,8);function m(B,u){const i=l("router-link");return p(),n("div",null,[d,c,A,o,s("nav",g,[s("ul",null,[s("li",null,[e(i,{to:"#_1-本次老代码线上问题sql"},{default:t(()=>[k("1. 本次老代码线上问题sql：")]),_:1})])])]),y])}const b=a(r,[["render",m],["__file","040728.html.vue"]]),C=JSON.parse(`{"path":"/develop/sql/040728.html","title":"","lang":"zh-CN","frontmatter":{"description":"title: 记录一次sql线上sql优化问题 index: true icon: laptop-code category: sql 1. 本次老代码线上问题sql： 主要出现问题的地方在范围查询上，由于数据量比较大，且范围查询导致索引失效。 经过分析，这条sql是先从数据库把数据从数据库查出后再拿到服务层排序。这个分数据库目前数据量为100万。考虑...","head":[["meta",{"property":"og:url","content":"https://https://github.com/WQMSLX/wqmslx.github.io/develop/sql/040728.html"}],["meta",{"property":"og:site_name","content":"纸飞机的博客"}],["meta",{"property":"og:description","content":"title: 记录一次sql线上sql优化问题 index: true icon: laptop-code category: sql 1. 本次老代码线上问题sql： 主要出现问题的地方在范围查询上，由于数据量比较大，且范围查询导致索引失效。 经过分析，这条sql是先从数据库把数据从数据库查出后再拿到服务层排序。这个分数据库目前数据量为100万。考虑..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-28T10:16:14.000Z"}],["meta",{"property":"article:author","content":"纸飞机"}],["meta",{"property":"article:modified_time","content":"2024-07-28T10:16:14.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-07-28T10:16:14.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"纸飞机\\",\\"url\\":\\"https://wqmslx.github.io\\"}]}"]]},"headers":[{"level":3,"title":"1. 本次老代码线上问题sql：","slug":"_1-本次老代码线上问题sql","link":"#_1-本次老代码线上问题sql","children":[]}],"git":{"createdTime":1722161774000,"updatedTime":1722161774000,"contributors":[{"name":"WangQiming","email":"1358632259@qq.com","commits":1}]},"readingTime":{"minutes":1.4,"words":419},"filePathRelative":"develop/sql/040728.md","localizedDate":"2024年7月28日","excerpt":"<hr>\\n<p>title: 记录一次sql线上sql优化问题\\nindex: true\\nicon: laptop-code\\ncategory:</p>\\n<ul>\\n<li>sql</li>\\n</ul>\\n<hr>\\n\\n<h3>1. 本次老代码线上问题sql：</h3>\\n<div class=\\"language-sql line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"sql\\" data-title=\\"sql\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic\\">-- </span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">select</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> * </span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">from</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> user </span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">where</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> create_time </span><span style=\\"--shiki-light:#383A42;--shiki-dark:#56B6C2\\">&gt;</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\">'2022-01-01'</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">and</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> create_time </span><span style=\\"--shiki-light:#383A42;--shiki-dark:#56B6C2\\">&lt;=</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> '2024-06-27'</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">order by</span><span style=\\"--shiki-light:#383A42;--shiki-dark:#ABB2BF\\"> id </span><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">desc</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">limit</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> 1500000</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{b as comp,C as data};

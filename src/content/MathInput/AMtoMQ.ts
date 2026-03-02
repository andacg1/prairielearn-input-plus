/*


TODO:

Create eval version of MQtoAM and display version: different handling of abs, emptyset
add back space after nodes; compensate with trim on removebrackets




AMtoMQ.js
(c) 2019 David Lippman

Converts AsciiMath in MathQuill's version of TeX

Based on ASCIIMathML, Version 1.4.7 Aug 30, 2005, (c) Peter Jipsen http://www.chapman.edu/~jipsen
Modified with TeX conversion for IMG rendering Sept 6, 2006 (c) David Lippman http://www.pierce.ctc.edu/dlippman
Licensed under GNU General Public License (at http://www.gnu.org/copyleft/gpl.html)
*/

/*
\left| expr \right| to  abs(expr)
\left( expression \right)  to   (expression)
\sqrt{expression}  to sqrt(expression)
\nthroot{n}{expr}  to  root(n)(expr)
\frac{num}{denom} to (num)/(denom)
\langle whatever \rangle   to   < whatever >                 **not done yet
\begin{matrix} a&b\\c&d  \end{matrix}    to  [(a,b),(c,d)]   **not done yet

n\frac{num}{denom} to n num/denom
*/
export function MQtoAM(tex: string, display: boolean) {
    let nested,rb,isfuncleft,curpos,c,i;
    tex = tex.replace(/\\:/g,' ');
    tex = tex.replace(/\\operatorname{(\w+)}/g,' $1');
    if (!display) {
        while ((i = tex.lastIndexOf('\\left|'))!=-1) { //found a left |)
            rb = tex.indexOf('\\right|',i+1);
            if (rb!=-1) {  //have a right |  - replace with abs( )
                isfuncleft = tex.substring(0,i).match(/(arcsinh|arccosh|arctanh|arcsech|arccsch|arccoth|arcsin|arccos|arctan|arcsec|arccsc|arccot|sinh|cosh|tanh|sech|csch|coth|ln|log|exp|sin|cos|tan|sec|csc|cot)(\^\d+)?$/);
                tex = tex.substring(0,rb) + ")" + (isfuncleft?')':'') + tex.substring(rb+7);
                tex = tex.substring(0,i) + (isfuncleft?'(':'') + "abs(" + tex.substring(i+6);
            } else {
                tex = tex.substring(0,i) + "|" + tex.substring(i+6);
            }
        }
        tex = tex.replace(/\\text{\s*or\s*}/g,' or ');
        tex = tex.replace(/\\text{all\s+real\s+numbers}/g,'all real numbers');
        tex = tex.replace(/\\text{DNE}/g,'DNE');
        tex = tex.replace(/\\varnothing/g,'DNE');
        tex = tex.replace(/\\Re/g,'all real numbers');
    } else {
        tex = tex.replace(/\\Re/g,'RR');
    }
    tex = tex.replace(/\\begin{.?matrix}(.*?)\\end{.?matrix}/g, function(_m, p) {
        return '[(' + p.replace(/\\\\/g,'),(').replace(/&/g,',') + ')]';
    });
    tex = tex.replace(/\\le(?=(\b|\d))/g,'<=');
    tex = tex.replace(/\\ge(?=(\b|\d))/g,'>=');
    tex = tex.replace(/\\ne(?=(\b|\d))/g,'!=');
    tex = tex.replace(/\+\-/g,'+ -'); // ensure spacing so it doesn't interpret as +-
    tex = tex.replace(/\\pm/g,'+-');
    tex = tex.replace(/\\approx/g,'~~');
    tex = tex.replace(/(\\arrow|\\rightarrow)/g,'rarr');
    tex = tex.replace(/\\rightleftharpoons/g,'rightleftharpoons');
    // move to intervalscorepart tex = tex.replace(/\\cup/g,'U');
    tex = tex.replace(/\\sim/g,'~');
    tex = tex.replace(/\\vee/g,'vv').replace(/\\wedge/g,' ^^ ');
    tex = tex.replace(/\\Rightarrow/g,'=>').replace(/\\Leftrightarrow/g,'<=>');
    tex = tex.replace(/\\times/g,'xx');
    tex = tex.replace(/\\left\\{/g,'lbrace').replace(/\\right\\}/g,'rbrace');
    tex = tex.replace(/\\left/g,'');
    tex = tex.replace(/\\right/g,'');
    tex = tex.replace(/\\langle/g,'<<');
    tex = tex.replace(/\\rangle/g,'>>');
    tex = tex.replace(/\\cdot/g,'*');
    tex = tex.replace(/\\infty/g,'infty');
    tex = tex.replace(/\\nthroot/g,'root');
    tex = tex.replace(/\\overline/g,'bar');
    tex = tex.replace(/\\mid/g,'|');
    tex = tex.replace(/\\/g,'');
    tex = tex.replace(/sqrt\[(.*?)\]/g,'root($1)');
    tex = tex.replace(/(\d)frac/g,'$1 frac');
    tex = tex.replace(/degree/g,'degree '); // prevent degreesin from becoming degree in

    while ((i=tex.indexOf('frac{'))!=-1) { //found a fraction start
        nested = 1;
        curpos = i+5;
        while (nested>0 && curpos<tex.length-1) {
            curpos++;
            c = tex.charAt(curpos);
            if (c=='{') { nested++;}
            else if (c=='}') {nested--;}
        }
        if (nested==0) {
            tex = tex.substring(0,i)+"("+tex.substring(i+5,curpos)+")/"+tex.substring(curpos+1);
        } else {
            tex = tex.substring(0,i) + tex.substring(i+4);
        }
    }

    //separate un-braced subscripts using latex rules
    tex = tex.replace(/_(\w)(\w)/g, '_$1 $2');
    tex = tex.replace(/(\^|_){([+\-])}/g, '$1$2');  // restore previous behavior
    tex = tex.replace(/(\^|_)([+\-])([^\^])/g, '$1$2 $3');
    tex = tex.replace(/\^(\w)(\w)/g, '^$1 $2');
    tex = tex.replace(/_{([\d\.]+)}(\w)/g,'_$1 $2');
    tex = tex.replace(/_{([\d\.]+)}([^\w])/g,'_$1$2');
    tex = tex.replace(/_{([\d\.]+)}$/g,'_$1');
    tex = tex.replace(/_{(\w+)}$/g,'_($1)');
    tex = tex.replace(/{/g,'(').replace(/}/g,')');
    tex = tex.replace(/lbrace/g,'{').replace(/rbrace/g,'}');
    tex = tex.replace(/\(([\d\.]+)\)\/\(([\d\.]+)\)/g,'$1/$2 ');  //change (2)/(3) to 2/3
    tex = tex.replace(/\/\(([\d\.]+)\)/g,'/$1 ');  //change /(3) to /3
    tex = tex.replace(/\(([\d\.]+)\)\//g,'$1/');  //change (3)/ to 3/
    tex = tex.replace(/\/\(([a-zA-Z])\)/g,'/$1 ');  //change /(x) to /x
    tex = tex.replace(/(^|[^a-zA-Z])\(([a-zA-Z])\)\//g,'$1$2/');  //change (x)/ to x/
    tex = tex.replace(/\^\((-?[\d\.]+)\)(\d)/g,'^$1 $2');
    tex = tex.replace(/\^\(-1\)/g,'^-1');
    tex = tex.replace(/\^\((-?[\d\.]+)\)/g,'^$1');
    tex = tex.replace(/\/\(([a-zA-Z])\^([\d\.]+)\)/g,'/$1^$2 ');  //change /(x^n) to /x^n
    tex = tex.replace(/\(([a-zA-Z])\^([\d\.]+)\)\//g,'$1^$2/');  //change (x^n)/ to x^n/
    tex = tex.replace(/text\(([^)]*)\)/g, '$1');
    tex = tex.replace(/\(\s*(\w)/g,'($1').replace(/(\w)\s*\)/g,'$1)');
    return tex.replace(/\s+/,' ').replace(/^\s+|\s+$/g,'');
}

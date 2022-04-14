//not tested!
/**
* @author Shea Frederick - http://www.vinylfox.com
* @contributor Nigel (Animal) White
* <p>A 'Shake' effect for the ExtJS Fx class</p>
*/
Ext.define('YZSoft.src.overrides.dom.Element', {
    override: 'Ext.dom.Element',

    /**
    * Shakes an element left to right or up and down. Shaking decreases until the element settles back into its original position.
    * Usage:
    *<pre><code>
    // default: shake left to right (x) five times with an excitement level of 2
    el.shake();
    // custom: shake up and down 10 times with an excitement level of 4
    el.shake({ direction: 'y', shakes: 10, excitement: 4 });
    </code></pre>
    * @param {Object} options (optional) Object literal with any of the Shake config options (direction of 'x' or 'y', shakes, and excitement)
    * @return {Ext.Element} The Element
    */
    shake: function (o) {
        o = Ext.applyIf(o || {}, {
            shakes: 3,
            excitement: 1,
            direction: 'x',
            duration: 50
        });
        var me = this,
            dom = me.dom,
            c = o.direction.toUpperCase(),
            a = Ext.fly(dom).getStyle('position') == 'absolute',
            pos = a ? Ext.fly(dom)['get' + c]() : 0,
            attr = (c == 'X') ? 'x' : 'y',
            s = o.shakes,
            r = s * 2,
            e = o.excitement * 2,
            sp = Ext.fly(dom).getPositioning(),
            animArg = {};

        animArg = {
            to: {
            },
            duration: o.duration,
            callback: function () {
                if (--r > 0)
                    animFn();
                else {
                    Ext.fly(dom).setPositioning(sp);
                    if (o.callback)
                        o.callback.call(o.scope || me);
                }
            }
        };

        if (!a) {
            me.position();
        }

        function animFn() {
            animArg.to[attr] = (r & 1) ? pos - (s-- * e) : pos + (s * e);
            me.animate(animArg);
        }

        animFn();
        return me;
    }
});
<template>
  <div>
    <p>
      Over the years, I have grown to appreciate and love the art of writing
      code to solve problems. It feels more natural to me to approach things
      programmatically. While I love everything Unity’s editor tools offer,
      nothing will ever beat the satisfaction of building games within an IDE.
      When it comes to creating visually dependent mechanics and experiences in
      my games, I build dynamic code-driven solutions that allow me to have the
      level of control I need for rapid development.
    </p>
    <p>
      In a more utilitarian definition, an animation is a sequence of explicitly
      defined states (frames) of an entity and its properties against a
      timescale. Controlling the ultra-precise dash movement in a 2D
      metroidvania, handcrafting the timing of shader and particle effects
      triggered during an ultimate attack, or having the flickering lights in a
      dark room build the ambience in your horror game- all of these examples
      can be interpreted as forms of dynamic animation.
    </p>
    <p>
      After a few years of building 2D games, I've learned to write dynamic
      animated events that can interface with surrounding systems. This not only
      results in the creation of more complex gameplay features, but saves time
      that would otherwise be more beneficial in other areas of the game. In my
      attempts to accomplish this within the Unity Animator I discovered a
      limitation: time. Building many variations of the same animation with
      transitions/blendtrees connecting them can give the illusion to the player
      that it is dynamic. Although, this isn’t always feasible or practical, as
      well as there being a fundamental limitation relying on statically defined
      animations. In this article I will go over how I instead use the power of
      coroutines to write programmatic animations so you can create these
      gameplay mechanics easily and ultimately with more control.
    </p>
    <p>
      <em
        >NOTE: When I refer to animations in the scope of this article I am
        <strong>not</strong> referring to sprite animations. The Animator is how
        I accomplish this as it works best for me, but I do eventually want to
        explore solutions that move away from that. With that being said, I have
        heard of
        <a href="https://kybernetik.com.au/animancer/" target="_blank"
          >Animancer by Kybernetik</a
        >
        that is an asset for Unity to replace the animator using a code-driven
        approach. While I have not personally used it extensively I think the
        idea of it is very powerful and worth checking out.</em
      >
    </p>
    <h3 id="thecoroutine">The Coroutine</h3>
    <p>
      Without diving into the technical know-how of what a coroutine is, as a
      developer all you care about is that a coroutine lets you easily write
      code that seemingly runs in its own update loop. Despite what that may
      imply it is NOT a multi-threaded or multi-processed operation as it still
      runs on the main thread, it will not offer any of the benefits of
      parallelism. The true power of the coroutines comes from its intuitive
      developer experience when writing time-dependent code. If you have ever
      attempted to write even the most basic logic involving time in an Update
      loop, you’ll know it’s a nightmare. By comparison, coroutines allow you to
      accomplish the same in just a few lines of readable code.
    </p>
    <p>
      Once you've mastered the power of the <code>yield</code> statement in
      coroutines, there’s no limit to what you can create.
    </p>
    <ul>
      <li><code>yield return null</code> -&gt; Waits a single update frame.</li>
      <li>
        <code>yield return new WaitForFixedUpdate()</code> -&gt; Waits for the
        fixed update frame, should be used for situations involving physics.
      </li>
      <li>
        <code>yield return new WaitForEndOfFrame()</code> -&gt; Similar to
        <code>LateUpdate</code> but for coroutines, useful for when you need to
        wait for rendering and physics to be completed.
      </li>
      <li>
        <code>yield return new WaitForSeconds()/WaitForSecondsRealtime()</code>
        -&gt; Halts the coroutine for a period of time, for our use case this
        allows us to add timed pauses similar to spacing out frames in an
        animation.
      </li>
      <li>
        <code>yield return new WaitUntil()/WaitWhile()</code> -&gt; Not
        something I've ever used for animations, I can see this being more
        useful for other applications.
      </li>
    </ul>
    <p>
      These are nice and all but one thing that can't easily be done is
      controlling how a property changes from one value to the another over a
      period of time- a fundamental concept in animation.
    </p>
    <h3 id="lerp">Lerp</h3>
    <p>
      Lerping is the process of following a linear interpolation between two
      data points where given a value <code>a</code>, <code>b</code>, and
      <code>t</code> will return you <code>a + (b-a) * t</code>. If that doesn't
      really make sense I don't blame you. As a game developer I imagine lerps
      as a straight line that can be traversed from one end to another, and the
      <code>t</code> parameter representing the percentage "progress" along that
      line within the range [0,1]. <code>t=0</code> is the start of the line,
      <code>t=0.5</code> is in the middle, and <code>t=1</code> is the end.
    </p>
    <p>
      Lerping gives us the power to control how a property can move from one
      value to another, and when mapped over a period of time represents the
      animated transition of that property. To actually utilise lerping inside
      coroutines I wrote this very simple util that given a duration, controls
      the timing needed for lerps on a per-frame basis.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public static class CoroutineUtils {

  /// &lt;summary&gt;
  /// provides a util to easily control the timing of a lerp over a duration
  /// &lt;/summary&gt;
  /// &lt;param name="duration"&gt;How long our lerp will take&lt;/param&gt;
  /// &lt;param name="action"&gt;The action to perform per frame of the lerp, is given the progress t in [0,1]&lt;/param&gt;
  public static IEnumerator Lerp(float duration, Action&lt;float&gt; action) {
    float time = 0;
    while (time &lt; duration) {
      float delta = Time.deltaTime;
      float t = (time + delta &gt; duration) ? 1 : (time / duration);
      action(t);
      time += delta;
      yield return null;
    }
    // handle the last frame
    action(1);
  }
}
</code></pre>
    </CodeBlock>
    <p>
      <em
        >NOTE: The name of the util is a bit misleading since it doesn't
        actually perform the lerp, given that it's always used with one I
        figured it's a fitting name.</em
      >
    </p>
    <p>The util can than be easily used as shown in this simple example:</p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">private IEnumerator animation() {
  const float InitialDelay = 5;
  const float EndDelay = 5;
  const float TransitionTime = 5;
  Color StartColor = Color.white;
  Color EndColor = Color.red;
  yield return new WaitForSeconds(InitialDelay);

  // Lerp the renderer's color from white -&gt; red -&gt; white
  yield return CoroutineUtil.Lerp(TransitionTime / 2, t =&gt; {
    this.renderer.color = Color.Lerp(StartColor, EndColor, t);
  });
  yield return CoroutineUtil.Lerp(TransitionTime / 2, t =&gt; {
    this.renderer.color = Color.Lerp(EndColor, StartColor, t);
  });

  yield return new WaitForSeconds(EndDelay);
}
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/color-lerp-example.gif'
        }"
      />
    </p>
    <p>
      The power of this util is that you are not tied to what you want to
      animate or how. You can use whatever lerping method you want since the
      function primarily controls the timing for your lerps. Whether you need to
      animate numbers (<code>Mathf.Lerp</code>), transform positions
      (<code>Vector2.Lerp</code>), or colors (<code>Color.Lerp</code>), there
      are plenty of methods you can use with the util to create dynamically
      animated events in your game. If you're adventurous you could use an
      entirely different interpolation method, although in later sections you'll
      see there might not be a need to do that at all.
    </p>
    <p>
      This is a good start but the limitation with lerping is that it is a
      <strong>linear</strong> interpolation. For animations this means it will
      only animate properties in a linear time-scale. Those with any animation
      experience understand that linear movement is not the only way to
      transition properties, nor is it always the desired one.
    </p>
    <p>
      This util is brought to the next level when we utilise the
      <code>AnimationCurve</code> class in our <code>Lerp</code> util to allow
      us to control the time curve with hand-placed precision.
    </p>
    <h3 id="animationcurve">AnimationCurve</h3>
    <p>
      <code>AnimationCurve</code> is one of the core classes that powers the
      animation system in Unity, it is used in animation clips to provide a
      function of a property's value over time.
    </p>
    <p>
      The main usage of this class that we need is its
      <code>Evaluate</code> method which gives us the value of a point on the
      curve at a given time. The curve is modelled as a mathematical function
      over an x/y axis, a reminder to those that <code>f(x)=mx+b</code> is still
      a thing after highschool. Normally this is used to control a property of
      an animation's target object over time, but for our case we will use it to
      control the <code>t</code> parameter of our lerps. This essentially allows
      us to have non-linear interpolation and to unlock the true potential of
      building various kinds of animations using coroutines.
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/animation-curve-editor.jpg',
          subtitle:
            'With a built-in property editor for our <code>AnimationCurve\'s</code> serialized/public variables, polishing our animations timing is easy and intuitive. As an added bonus if you add <a href=\'https://forum.unity.com/threads/copy-and-paste-curves.162557/#post-1277055\'>this editor script</a> to an <code>/Editor</code> folder you can enable copy/pasting of curves.'
        }"
      />
    </p>
    <p>
      This integration with our <code>Lerp</code> util can be implemented as the
      following:
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// provides a util to easily control the timing of a lerp over a duration
/// &lt;/summary&gt;
  /// &lt;param name="duration"&gt;How long our lerp will take&lt;/param&gt;
  /// &lt;param name="action"&gt;The action to perform per frame of the lerp, is given the progress t in [0,1]&lt;/param&gt;
/// &lt;param name="curve"&gt;If we want out time curve to follow a specific animation curve&lt;/param&gt;
/// &lt;returns&gt;&lt;/returns&gt;
public static IEnumerator Lerp(float duration, Action&lt;float&gt; action, AnimationCurve curve = null) {
  float time = 0;

  // by default we use a linear evaluation
  Func&lt;float, float&gt; tEval = t =&gt; t;

  // If a curve is provided follow the curve for our t evaluations instead
  if (curve != null) tEval = t =&gt; curve.Evaluate(t);
  while (time &lt; duration) {
    float delta = Time.deltaTime;
    float t = (time + delta &gt; duration) ? 1 : (time / duration);
    action(tEval(t));
    time += delta;
    yield return null;
  }
  action(tEval(1));
}
</code></pre>
    </CodeBlock>
    <p>
      One caveat is that for all of our animation curves we use we should always
      ensure it is normalised between [0,1] in the x-axis since our lerp will
      only ever be evaluated in that range. Whether this is enforced in code or
      good practices in the editor- the idea is the same.
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/animation-curves.gif',
          subtitle:
            'Showing how different animation curves affect the look and feel of the same translation. Small changes like this can help you polish the presentation and quality of your gameplay.'
        }"
      />
    </p>
    <h3 id="someextras">Some extras</h3>
    <p>
      The following is the util as it stands in my current codebase with all of
      its extra features, code can be found
      <a
        href="https://github.com/mbitzos/devblog-code-examples/tree/main/programmatic-animation-using-coroutines"
        >here on my GitHub.</a
      >
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// provides a util to easily control the timing of a lerp over a duration
/// &lt;/summary&gt;
/// &lt;param name="duration"&gt;How long our lerp will take&lt;/param&gt;
/// &lt;param name="action"&gt;The action to perform per frame of the lerp, is given the progress t in [0,1]&lt;/param&gt;
/// &lt;param name="realTime"&gt;If we want to run our lerp on real time&lt;/param&gt;
/// &lt;param name="smooth"&gt;If we want our time curve to run on a smooth step&lt;/param&gt;
/// &lt;param name="curve"&gt;If we want our time curve to follow a specific animation curve&lt;/param&gt;
/// &lt;param name="inverse"&gt;If we want the time to be inversed such that it returns t-1&lt;/param&gt;
/// &lt;returns&gt;&lt;/returns&gt;
public static IEnumerator Lerp(
  float duration,
  Action&lt;float&gt; action,
  bool realTime = false,
  bool smooth = false,
  AnimationCurve curve = null,
  bool inverse = false
) {
  float time = 0;
  Func&lt;float, float&gt; tEval = t =&gt; t;
  if (smooth) tEval = t =&gt; Mathf.SmoothStep(0, 1, t);
  if (curve != null) tEval = t =&gt; curve.Evaluate(t);
  while (time &lt; duration) {
    float delta = realTime ? Time.fixedDeltaTime : Time.deltaTime;
    float t = (time + delta &gt; duration) ? 1 : (time / duration);
    if (inverse)
      t = 1 - t;
    action(tEval(t));
    time += delta;
    yield return null;
  }
  action(tEval(inverse ? 0 : 1));
}
</code></pre>
    </CodeBlock>
    <h2 id="puttingitalltogether">Putting it all together</h2>
    <p>
      With <code>Lerp</code> and <code>WaitForSeconds</code> you will be able to
      make just about any form of dynamic animation in a coroutine that is
      easily controllable with code.
    </p>
    <p>
      Here is some examples of how I've used coroutines to control animated
      events in my games:
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/card-deck-animation.gif',
          subtitle:
            'Controlling how the cards fit together in a players deck for a carding building prototype. Having this built with code allowed me to easily create a card deck that was constantly changing in size.'
        }"
      />
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">// Card fade animation
yield return CoroutineUtil.Lerp(FadeTime, t =&gt; {
  Color c = FrameSprite.color;
  c.a = Mathf.Lerp(initial, 1f, t);
  FrameSprite.color = c;
});
---
// Card hover/unhover animation
yield return CoroutineUtil.Lerp(HoverTime, t =&gt; {
  cardTransform.localPosition = Vector2.Lerp(originalPosition, target, t);
}, smooth : true);
---
// Deck organizer animation
yield return CoroutineUtil.Lerp(TransitionTime, t =&gt; {

  // set positions
  for (int i = 0; i &lt; size; i++) {
    Vector2 pos = Vector2.Lerp(originalPositions[i], newPositions[i], t);
    cards[i].transform.position = new Vector3(pos.x, pos.y, cards[i].transform.position.z);
  }
}, smooth : true);
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/attack-dash-animations.gif',
          subtitle:
            'Polishing the exact distance and timing of a players strong attack lunge and dash for a snappy beat-em-up experience. Since this lunge could be enhanced by item stats, having the parameters of the animation driven by variables in the code made it easy to test and adjust.'
        }"
      />
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">// Jump/attack movement animation
yield return CoroutineUtil.Lerp(timeUntilNextBeat, t =&gt; {
  end.x += xMovement;
  end.y += yMovement;
  stateObject.SetPosition(Vector2.Lerp(start, end, t));
  Vector2 dropshadowSize = dropShadowLocalScale.Copy();
  float size = stateObject.HeavyAttackDropShadowAnim.Evaluate(t).RoundTo(0.1f);
  dropshadowSize += size * Vector2.one;
  stateObject.dropShadow.transform.localScale = dropshadowSize;
}, curve : stateObject.HeavyAttackJumpCurve);
---
// Dash Animation
yield return CoroutineUtil.Lerp(stateObject.DashTime, t =&gt; {
  stateObject.SetPosition(Vector2.Lerp(initial, target, t));
}, curve : stateObject.DashCurve);
---
// Dash ghost effect
Sprite ghostSprite = stateObject.CharacterRenderer.sprite;
while (ghosts &lt; stateObject.DashGhosts) {
  ghosts++;
  spawnGhost(ghostSprite);
  yield return wait;
}
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri:
            'posts/programmatic-animation-using-coroutines/ambient-lighting-animations.gif',
          subtitle:
            'Building a system of ambient lighting in our horror game using coroutine animations allowed us to have in-game events dynamically influence the atmosphere around the player.'
        }"
      />
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">// the idle animator of the lights
IEnumerator idleAnimation() {
  while (true) {

    // randomly wait
    float wait = UnityEngine.Random.Range(MinWait, MaxWait);

    if (StartingState)
      switch (lightFlickerMode) {
        case LightFlickerMode.Soft:
          yield return StartCoroutine(softFlicker(Mathf.Infinity)); // enter infinite loop for soft flicker
          break;
        case LightFlickerMode.Hard: // just wait
          yield return new WaitForSeconds(wait);
          break;
        case LightFlickerMode.All:
          yield return StartCoroutine(softFlicker(wait)); // enter waiting period with soft flicker
          break;
      }
    else
      yield return new WaitForSeconds(wait);

    // randomly flicker
    int flickerAmount = UnityEngine.Random.Range(MinFlicker, MaxFlicker + 1);
    yield return StartCoroutine(flickerAnimation(flickerAmount));
  }
}

// the rapid flickering of the light animation
IEnumerator flickerAnimation(int flickerCount) {
  while (flickerCount &gt; 0) {
    toggleLight(!state);
    yield return new WaitForSeconds(FlickerRate);
    toggleLight(!state);
    yield return new WaitForSeconds(FlickerRate);
    flickerCount--;
  }
}

// animates a rapid soft flicker on idle
IEnumerator softFlicker(float idleTime) {
  float originalIntensity = intensity;
  float nextIntensity = originalIntensity * SoftFlickerModifer;

  while (idleTime &gt; 0) {
    intensity = nextIntensity;
    yield return softFlickerWait;
    intensity = originalIntensity;
    yield return softFlickerWait;
    idleTime -= SoftFlickerRate * 2;
  }
}
</code></pre>
    </CodeBlock>
    <p>
      Simply having the ability to edit public/serializable variables for my
      animations during run-time makes development fast and satisfying. As I
      play my game I can immediately see the impact the changes my variables
      make to my animations. This is especially useful when you are in the
      polishing stages of a feature and need to find that magic number.
    </p>
    <h2 id="conclusion">Conclusion</h2>
    <p>
      Coroutines are a very powerful tool that allow you to quickly create
      dynamic animations with none of the compromise. If you’ve ever felt the
      time sink of creating animated events using the Unity Animator, I hope
      that this article will help you see things from a programmatic perspective
      and unshackle yourself from the limitations of statically defined
      animations.
    </p>
    <p>
      All of the code examples can be found
      <a
        href="https://github.com/mbitzos/devblog-code-examples/tree/main/programmatic-animation-using-coroutines"
        target="_blank"
        >here on my GitHub.</a
      >
    </p>
    <p>
      All of the pixel art shown was created by our artist for various games
      we've worked on,
      <a href="https://www.artstation.com/pixelgrim" target="_blank"
        >check out his artstation</a
      >.
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import PostImageComponent from "@/views/devblog/components/image.vue";
import CodeBlock from "@/views/devblog/components/code.vue";
export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PostImageComponent,
    // eslint-disable-next-line vue/no-unused-components
    CodeBlock
  }
});
</script>
<style lang="scss"></style>

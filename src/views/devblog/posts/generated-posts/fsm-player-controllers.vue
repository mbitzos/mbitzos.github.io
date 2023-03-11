<template>
  <div>
    <p>
      One of the biggest mistakes beginner programmers make is defining classes
      and functions with too many responsibilities. For game developers this is
      often seen in the code that models your main playable entity in the game,
      ie the player controller. By managing too many responsibilities in a
      single place you are making it harder for yourself to grow, maintain, and
      debug your codebase.
    </p>
    <p>
      With the accessibility of Unity's pre-built update loops
      (<code>Update</code>, <code>FixedUpdate</code>, <code>LateUpdate</code>)
      it is extremely easy to find yourself writing an unwieldy amount of code
      to control your player in a single class. With an unorganized mess of
      <code>if/elses</code>, edge cases, and a string of mechanics interspersed
      within one another, this becomes a nightmare in the present, and untenable
      in the future.
    </p>
    <p>
      Online Unity tutorials and introductory materials tend to stress the use
      of the <code>Update</code> method for showcasing code. Placing large
      chunks of code here gives newcomers the impression that this is where the
      bulk of code should reside. These tutorials meant to show you snippets of
      prototype implementations fail to demonstrate the kind of infrastructure
      needed to work on long term projects with evolving requirements, nor
      should they.
    </p>
    <p>
      This is one of difficulties I experienced when first getting into Unity
      and learning programming. The steps below breakdown how I am able to build
      a player controller beyond the prototype by utilizing finite state
      machines to cleanly manage my player states all while avoiding any of the
      mess of <code>if/else</code> or <code>switch</code> statements.
    </p>
    <h2 id="finitestatemachines">Finite state machines</h2>
    <p>
      A finite state machine (FSM) is a mathematical model described as a system
      that contains states, a reference to the current state, transitions
      connecting states together, and inputs/conditions that trigger the
      transition from one state to another. If you have any experience creating
      animations in Unity, Mecanim is a perfect example of what a state machine
      accomplishes.
    </p>
    <p>
      A lot of game mechanics are implicitly designed as some form of a state
      machine since most things in a game are intrinsically stateful. They
      contain some model data that when some conditions are met will result in a
      change in its behaviour.
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/fsm-player-controllers/fsm-locked-door.jpg',
          subtitle: 'A locked door in a game modelled as a basic FSM'
        }"
      />
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/fsm-player-controllers/fsm-quest.jpg',
          subtitle: 'A questline in an RPG modelled as a basic FSM'
        }"
      />
    </p>
    <p>
      As you can see, it is very easy to design even the most basic mechanics as
      FSMs because it allows you to break down complex problems into
      understandable mental models. In the next section I will show how you can
      create an FSM framework that will help you build out your player
      controller.
    </p>
    <h2 id="theimplementation">The implementation</h2>
    <p>
      The following are all essential classes you will need for your FSM
      framework:
    </p>
    <h3 id="finitestatemachinecs">FiniteStateMachine.cs</h3>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models a basic finite state machine
/// Manages all the states in the FSM including transitions
/// &lt;/summary&gt;
public class FiniteStateMachine {

  Dictionary&lt;Type, State&gt; states = new Dictionary&lt;Type, State&gt;();

  public State currentState {
    get;
    private set;
  }
  State defaultState;

  PlayerController player;

  /// &lt;summary&gt;
  /// Constructs a new finite state machine
  /// &lt;/summary&gt;
  public FiniteStateMachine(PlayerController player) {
    this.player = player;
  }

  /// &lt;summary&gt;
  /// Initializes the FSM with the states 
  /// &lt;/summary&gt;
  protected void setStates(List&lt;State&gt; states, State defaultState) {
    this.states.Clear();
    foreach (var state in states) {
      this.states.Add(state.GetType(), state);
    }
    this.defaultState = defaultState;
  }

  /// &lt;summary&gt;
  /// Starts the FSM
  /// &lt;/summary&gt;
  public void Start() {
    this.ChangeState(defaultState);
  }

  /// &lt;summary&gt;
  /// Triggers an update
  /// &lt;/summary&gt;
  public void Update() {
    if (currentState != null)
      currentState.Update();
  }

  /// &lt;summary&gt;
  /// triggers a fixed Update
  /// &lt;/summary&gt;
  public void FixedUpdate() {
    if (currentState != null)
      currentState.FixedUpdate();
  }

  /// &lt;summary&gt;
  /// Change to new state
  /// &lt;/summary&gt;
  /// &lt;typeparam name="S"&gt;The state to change to&lt;/typeparam&gt;
  public void ChangeState&lt;S&gt;() where S : State {
    ChangeState(states[typeof(S)]);
  }

  /// &lt;summary&gt;
  /// Change to new state
  /// &lt;/summary&gt;
  /// &lt;typeparam name="S"&gt;The state to change to&lt;/typeparam&gt;
  public void ChangeState(State state) {
    if (currentState != null) {
      currentState.OnExit();
    }
    currentState = state;
    currentState.OnEnter();
  }

  /// &lt;summary&gt;
  /// Changes to current state
  /// &lt;/summary&gt;
  public void ChangeToDefault() {
    ChangeState(defaultState);
  }
}
</code></pre>
    </CodeBlock>
    <p>
      This is the main orchestrator of the states and is to be the singular
      place we interface with the FSM framework. The FSM has basic functionality
      including the ability to provide the current state, set a default one, and
      of course change the current state.
    </p>
    <h3 id="statecs">State.cs</h3>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models a state in a basic FSM
/// &lt;/summary&gt;
public abstract class State {
  protected FiniteStateMachine fsm;
  protected PlayerController player;

  public State(FiniteStateMachine fsm, PlayerController player) {
    this.player = player;
    this.fsm = fsm;
  }

  /// &lt;summary&gt;
  /// What to do on entering the state
  /// &lt;/summary&gt;
  public abstract void OnEnter();

  /// &lt;summary&gt;
  /// What to do on exiting the state
  /// &lt;/summary&gt;
  public abstract void OnExit();

  public abstract void Update();
  public abstract void FixedUpdate();

  /// &lt;summary&gt;
  /// Goes to a new state (Wrapper for ChangeState)
  /// &lt;/summary&gt;
  public void Goto&lt;S&gt;() where S : State {
    fsm.ChangeState&lt;S&gt;();
  }

  /// &lt;summary&gt;
  /// Changes to default
  /// &lt;/summary&gt;
  public void GoToDefault() {
    fsm.ChangeToDefault();
  }
}
</code></pre>
    </CodeBlock>
    <p>
      This is an abstract implementation of a single state in your FSM that
      allows you implement it's lifecycle hooks via inheritance. Along with the
      player it will also contain a reference to your FSM itself so that the
      states can easily request to change to another state. You'll notice that
      neither of these classes are extending from Unity's
      <code>MonoBehaviour</code> class, meaning they will not function as
      components you attach to your gameobjects. This will instead be used as a
      basic C# object that gets instantiated and has its lifecycle methods
      called via your <code>PlayerController</code>, below you can see an
      example of this. This method is simply a preference of mine as I quite
      enjoy the engine-agnostic aspect of this implementation.
    </p>
    <p>
      I was interested in how this would look as a game object component so I
      went ahead and created one
      <a
        href="https://github.com/mbitzos/devblog-code-examples/tree/main/fsm-player-controllers/monobehaviour-example"
        >here.</a
      >
      In retrospect I think this approach is better for Unity specifically since
      <code>GetComponent</code> removes a lot of the boilerplate and lets us
      utilize Unity's serialization for state class variables. For my next
      project I'll be sure to try out this out to see how the two differ!
    </p>
    <p>
      The rest of the article is independent of this decision so don't fret if
      you decide to go with either implementation.
    </p>
    <p>
      Another thing you'll notice is that my original definition of a FSM
      contains the concept of "states" and "transitions". By comparison, my
      implementation doesn't explicitly define transitions as I believe them to
      be redundant for the use case of player state management. The focus of the
      FSM implementation is to decouple player state from the controller, the
      transitions are hardly the focus here and were less important for my
      use-case as well. This solution provides a great balance of strict
      separation of states with the freedom of transition control.
    </p>
    <h2 id="example">Example</h2>
    <p>
      Below is a barebones example of how I would implement a FSM for a player
      controller in an RPG.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models a basic fsm for a player
/// &lt;/summary&gt;
public class PlayerFSM : FiniteStateMachine {
  public PlayerFSM(PlayerController player) : base(player) {
    var defaultState = new DefaultState(this, player);
    var states = new List&lt;State&gt;() {
      defaultState,
      new DashState(this, player),
      new AttackState(this, player),
      new DeathState(this, player),
    };
    setStates(states, defaultState);
  }
}

/// &lt;summary&gt;
/// Default state to control the player
/// &lt;/summary&gt;
public class DefaultState : State {
  public DefaultState(FiniteStateMachine fsm, PlayerController player) : base(fsm, player) { }

  public override void FixedUpdate() { }

  public override void OnEnter() { }

  public override void OnExit() { }

  public override void Update() {
    if (Input.GetKeyDown(KeyCode.Space)) {
      Goto&lt;DashState&gt;();
    }
    // handle basic player movement physics + animation
  }
}

/// &lt;summary&gt;
/// Models when the player is performing an attack 
/// &lt;/summary&gt;
public class AttackState : State {
  public AttackState(FiniteStateMachine fsm, PlayerController player) : base(fsm, player) { }

  public override void OnEnter() {
    // Start attack animation
  }

  public override void OnExit() {
    // End attack animation
  }

  public override void Update() { }

  public override void FixedUpdate() {
    // perform attack physics movement
  }
}

/// &lt;summary&gt;
/// Models the state when the player dashes
/// &lt;/summary&gt;
public class DashState : State {
  public DashState(FiniteStateMachine fsm, PlayerController player) : base(fsm, player) { }

  public override void OnEnter() {
    // start dash animation
    // start i-frames
  }

  public override void OnExit() {
    // stop i-frames
  }

  public override void FixedUpdate() {
    // perform dash physics
  }
  public override void Update() { }
}

/// &lt;summary&gt;
/// Models the state when the player is dead 
/// &lt;/summary&gt;
public class DeathState : State {
  public DeathState(FiniteStateMachine fsm, PlayerController player) : base(fsm, player) { }

  public override void OnEnter() {
    // death animation
    // game over
    // stop inputs
  }

  public override void OnExit() { }

  public override void Update() { }

  public override void FixedUpdate() { }
}
</code></pre>
    </CodeBlock>
    <h2 id="beyond">Beyond</h2>
    <p>
      There is a ton we can do to further improve our FSM framework, it's up to
      you whether these features could help in your use-case but I recommend all
      of these for those that want to take their technical skills to the next
      level.
    </p>
    <h3 id="utilizinggenerics">Utilizing Generics</h3>
    <p>
      The above design is strictly for our player controller, but what if we
      have other things in our game that want to utilize a FSM? One solution is
      that we could design a FSM that expects to pass in a
      <code>MonoBehaviour</code> object, but that would require us to cast it
      everywhere.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public class ExampleState : State {
  public ExampleState(FiniteStateMachine fsm, Monobehaviour stateObject) : base(fsm, stateObject) {}
  public override void Update() {
    PlayerController player = stateObject as PlayerController; // :'(
    if (Input.GetKeyDown(KeyCode.Space)) {
      player.DoSomethingSpecificToPlayer();
    }
  }
}
</code></pre>
    </CodeBlock>
    <p>
      This is where the beauty of C#'s generics comes in to help us design an
      object-agnostic FSM without the drawbacks mentioned above. If you are new
      to generics I would suggest to first
      <a
        href="https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics"
        >read up on generics via the official C# documentation.</a
      >
    </p>
    <p>
      Essentially we change the definition of our FSM so that in our
      implementation of our states and FSM we can specify which type of
      <code>MonoBehaviour</code> we will be controlling.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models the finite state machine using generics
/// &lt;/summary&gt;
/// &lt;typeparam name="SO"&gt;[SO=State Object] This is the monobehaviour object that our FSM is controlling state for &lt;/typeparam&gt;
public class FiniteStateMachine&lt;SO&gt; where SO : MonoBehaviour {

  Dictionary&lt;Type, State&lt;SO&gt;&gt; states = new Dictionary&lt;Type, State&lt;SO&gt;&gt;();

  public State&lt;SO&gt; currentState {
    get;
    private set;
  }
  State&lt;SO&gt; defaultState;

  // This is the object that our FSM is controlling state for
  private SO stateObject;

  /// &lt;summary&gt;
  /// Constructs a new finite state machine
  /// &lt;/summary&gt;
  public FiniteStateMachine(SO stateObject) {
    this.stateObject = stateObject;
  }
  ...
}

/// &lt;summary&gt;
/// Models a state in an generic-powered FSM
/// &lt;/summary&gt;
/// &lt;typeparam name="SO"&gt;[SO=State Object] This is the object that our FSM is controlling state for &lt;/typeparam&gt;
public abstract class State&lt;SO&gt; where SO : MonoBehaviour {
  protected FiniteStateMachine&lt;SO&gt; fsm;
  protected SO stateObject;

  public State(FiniteStateMachine&lt;SO&gt; fsm, SO stateObject) {
    this.stateObject = stateObject;
    this.fsm = fsm;
  }
  ...
}
</code></pre>
    </CodeBlock>
    <p>
      From there you can see how easy it is to use the same FSM framework for
      different controllers.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">// FSM for player controller
#region Player
public class PlayerFSM : FiniteStateMachine&lt;PlayerController&gt; {
  public PlayerFSM(PlayerController player) : base(player) {
    // states
  }
}
public abstract class BasePlayerState : State&lt;PlayerController&gt; {
  protected BasePlayerState(PlayerFSM fsm, PlayerController player) : base(fsm, player) { }
}
public class DefaultState : BasePlayerState {
  public DefaultState(PlayerFSM fsm, PlayerController player) : base(fsm, player) { }
}

#endregion

// FSM for enemy controller
#region Enemy
public class EnemyFSM : FiniteStateMachine&lt;EnemyController&gt; {
  public EnemyFSM(EnemyController enemy) : base(enemy) {
    // states
  }
}
public abstract class BaseEnemyState : State&lt;EnemyController&gt; {
  protected BaseEnemyState(EnemyFSM fsm, EnemyController enemy) : base(fsm, enemy) { }
}
public class DefaultState : BaseEnemyState {
  public DefaultState(EnemyFSM fsm, EnemyController enemy) : base(fsm, enemy) { }
}
#endregion
</code></pre>
    </CodeBlock>
    <h3 id="onenterpayload">OnEnter Payload</h3>
    <p>
      One thing our original implementation lacks is the ability for our states
      to retrieve data via transitions. An example could be if you designed a
      knockback state for your player upon receiving damage and needed the
      specific attack data to control the physics behaviour of the hit.
    </p>
    <p>
      We can accomplish this easily by introducing a "payload" parameter in our
      <code>ChangeState</code> methods that then gets passed to the State's
      <code>OnEnter</code> method. Here I am defining the payload as
      <code>object</code> and building a helper function to cast it. You could
      instead use a <code>Dictionary</code> if you prefer json-style data.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public class FiniteStateMachine {
  ...
  public void ChangeState(State state, object payload = null) {
    if (currentState != null) {
      currentState.OnExit();
    }
    currentState = state;
    currentState.OnEnter(payload);
  }
  ...
}

public abstract class State {
  ...
  // Helper func to fetch and get the payload
  // will default if payload incorrectly is not found/casted
  protected P CastPayload&lt;P&gt;(object payload, P defaultt = default(P)) {
    try {
      return (P) payload;
    } catch {
      return defaultt;
    }
  }
  ...
}
</code></pre>
    </CodeBlock>
    <p>
      One drawback of this is that loosely defined data structures is prone to
      regression bugs. As a solo developer I never ran into issues but in an
      expanding team of developers one can see how bugs could arise if the
      payload or the payload cast was changed independently of one another. Unit
      tests would catch this, but I know none of us are writing those.
    </p>
    <p>
      You could probably design a more robust payload system using generics but
      I have not attempted this yet since it was overkill for me.
    </p>
    <h3 id="statepriority">State priority</h3>
    <p>
      A more niche thing I've done before is introduce the concept of state
      priority such that during <code>ChangeState</code> the FSM will only ever
      change the current state if the next state's priority is greater. This is
      useful if you have many transitions into a single state that can occur
      under the same conditions. Instead of writing behaviour outside the FSM to
      decide if the state should be changed, this can easily be done in the FSM
      framework. To be honest I personally found this was mostly unused in my
      projects.
    </p>
    <p>Here is what the FSM and State would look like:</p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public class FiniteStateMachine {
  ...
  // now returns if the state changed successfully
  public bool ChangeState(State state) {
    if (currentState != null &amp;&amp; currentState.priority &gt; state.priority)
      return false;
    if (currentState != null) {
      currentState.OnExit();
    }
    currentState = state;
    currentState.OnEnter();
    return true;
  }
  ...
}

public abstract class State {
  ...
  public int priority {
    get;
    private set;
  }

  public State(FiniteStateMachine fsm, PlayerController player, int priority = -1) {
    this.player = player;
    this.fsm = fsm;
    this.priority = priority;
  }
  ...
}
</code></pre>
    </CodeBlock>
    <h3 id="transitionextras">Transition extras</h3>
    <p>
      Right now the implementation leaves states in the dark regarding why an
      outside transition occurred.
    </p>
    <p>
      One useful thing we can do is allow our states to capture two pieces of
      information:
    </p>
    <ol>
      <li>
        <p>the next/previous state that is being changed to:</p>
        <p>
          a. The next/previous state is useful for specific use cases, but I
          would say that if this is needed more often than not it would probably
          be a better idea to go with a FSM framework that requires strictly
          defined transitions.
        </p>
      </li>
      <li>
        <p>if this current state was interrupted:</p>
        <p>
          a. This can be very important because it lets a state define the
          difference between a graceful exit and a forceful one. It's ultimately
          better to design your states such that your <code>OnExit</code> cleans
          up the state regardless of how it's exited, but this solution offers a
          quick shortcut to solve applicable edgecases.
        </p>
      </li>
    </ol>
    <CodeBlock>
      <pre><code class="csharp language-csharp">// Models a FSM that has some extra transition data
public class FiniteStateMachine {
  ...
  /// &lt;summary&gt;
  /// Change to new state
  /// &lt;/summary&gt;
  /// &lt;param name="state"&gt;&lt;/param&gt;
  /// &lt;param name="source"&gt;The state that called for this change, default is null if the signal came from outside the FSM&lt;/param&gt;
  /// &lt;returns&gt;if state change was successful&lt;/returns&gt;
  public bool ChangeState(State state, State source = null) {
    if (currentState != null &amp;&amp; currentState.priority &gt; state.priority)
      return false;
    if (currentState != null) {
      interrupt = currentState != source
      currentState.OnExit(interrupt, state);
    }
    previousState = state;
    currentState = state;
    currentState.OnEnter(previousState);
    return true;
  }
  ...
}

// Models a FSM state that has some extra transition data
public abstract class State {
  ...
  /// &lt;summary&gt;
  /// What to do on entering the state
  /// &lt;/summary&gt;
  public abstract void OnEnter(State previousState);

  /// &lt;summary&gt;
  /// What to do on exiting the state
  /// &lt;/summary&gt;
  public abstract void OnExit(bool interrupted, State nextState);

  /// &lt;summary&gt;
  /// Goes to a new state (Wrapper for ChangeState)
  /// &lt;/summary&gt;
  public void Goto&lt;S&gt;() where S : State {
    fsm.ChangeState&lt;S&gt;(this); // results in an uninterrupted exit
  }
  ...
}
</code></pre>
    </CodeBlock>
    <h2 id="lessonslearned">Lessons learned</h2>
    <ol>
      <li>
        <p>
          Writing poorly designed mechanically dense states in a FSM will simply
          offload your problems from the Update loop. The FSM is a tool but
          unlocking its potential is being able to effectively break down your
          controller into decoupled states.
        </p>
      </li>
      <li>
        <p>
          Decide early where you want to store your player model. It may seem
          obvious to have all of your player functions and properties in their
          respective state classes. However if those same functions need to be
          accessible from other places you should consider moving them to your
          PlayerController. One core rule of this FSM implementation is to never
          directly call functions and data in your state classes. If you do this
          you'll quickly understand that it's messy and is considered a failure
          in state design.
        </p>
      </li>
      <li>
        <p>
          Don't be afraid to use your engine's tools, they're there to help you
          make games faster and easier. I personally learned while writing this
          article how the <code>MonoBehaviour</code> approach to my FSM
          implementation is superior as it provides more functionality with less
          boilerplate code.
        </p>
      </li>
    </ol>
    <h2 id="conclusion">Conclusion</h2>
    <p>
      It is entirely possible to make a game with a single script for your
      player controller and it is not the determining factor for your games
      completion or success. Celeste is an example of a successful title
      <a
        href="https://github.com/NoelFB/Celeste/blob/master/Source/Player/Player.cs"
        >that has a single 5400 lined player controller script,</a
      >
      but I have no doubt there were great difficulties revolving around this.
      While it is not the only or last example of this, every step we can make
      as developers to improve our technical skills will result in fewer times
      we are limited in creating the dream game we all desire to make. Using
      FSMs is but just one example of doing so by designing a robust player
      controller that allows you to develop easily understandable yet complex
      mechanics for your player while maintaining the integrity of your
      ever-expanding code.
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

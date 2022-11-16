One of the biggest mistakes beginner programmers make is defining classes and functions with too many responsibilities. For game developers this is often seen in the code that models your main playable entity in the game, ie the player controller. By managing too many responsibilities in a single place you are making it harder for yourself to grow, maintain, and debug your codebase.

With the accessibility of Unity's pre-built update loops (`Update`, `FixedUpdate`, `LateUpdate`) it is extremely easy to find yourself writing an unwieldy amount of code to control your player in a single class. With an unorganized mess of `if/elses`, edge cases, and a string of mechanics interspersed within one another, this becomes a nightmare in the present, and untenable in the future.

Online Unity tutorials and introductory materials tend to stress the use of the `Update` method for showcasing code. Placing large chunks of code here gives newcomers the impression that this is where the bulk of code should reside. These tutorials meant to show you snippets of prototype implementations fail to demonstrate the kind of infrastructure needed to work on long term projects with evolving requirements, nor should they.

This is one of difficulties I experienced when first getting into Unity and learning programming. The steps below breakdown how I am able to build a player controller beyond the prototype by utilizing finite state machines to cleanly manage my player states all while avoiding any of the mess of `if/else` or `switch` statements. 


## Finite state machines

A finite state machine (FSM) is a mathematical model described as a system that contains states, a reference to the current state, transitions connecting states together, and inputs/conditions that trigger the transition from one state to another. If you have any experience creating animations in Unity, Mecanim is a perfect example of what a state machine accomplishes.

A lot of game mechanics are implicitly designed as some form of a state machine since most things in a game are intrinsically stateful. They contain some model data that when some conditions are met will result in a change in its behaviour.

$IMAGE$:{"uri":"posts/fsm-player-controllers/fsm-locked-door.jpg", "subtitle":"A locked door in a game modelled as a basic FSM"}

$IMAGE$:{"uri":"posts/fsm-player-controllers/fsm-quest.jpg", "subtitle":"A questline in an RPG modelled as a basic FSM"}

As you can see, it is very easy to design even the most basic mechanics as FSMs because it allows you to break down complex problems into understandable mental models. In the next section I will show how you can create an FSM framework that will help you build out your player controller.

## The implementation

The following are all essential classes you will need for your FSM framework:

### FiniteStateMachine.cs
```csharp
/// <summary>
/// Models a basic finite state machine
/// Manages all the states in the FSM including transitions
/// </summary>
public class FiniteStateMachine {

  Dictionary<Type, State> states = new Dictionary<Type, State>();

  public State currentState {
    get;
    private set;
  }
  State defaultState;

  PlayerController player;

  /// <summary>
  /// Constructs a new finite state machine
  /// </summary>
  public FiniteStateMachine(PlayerController player) {
    this.player = player;
  }

  /// <summary>
  /// Initializes the FSM with the states 
  /// </summary>
  protected void setStates(List<State> states, State defaultState) {
    this.states.Clear();
    foreach (var state in states) {
      this.states.Add(state.GetType(), state);
    }
    this.defaultState = defaultState;
  }

  /// <summary>
  /// Starts the FSM
  /// </summary>
  public void Start() {
    this.ChangeState(defaultState);
  }

  /// <summary>
  /// Triggers an update
  /// </summary>
  public void Update() {
    if (currentState != null)
      currentState.Update();
  }

  /// <summary>
  /// triggers a fixed Update
  /// </summary>
  public void FixedUpdate() {
    if (currentState != null)
      currentState.FixedUpdate();
  }

  /// <summary>
  /// Change to new state
  /// </summary>
  /// <typeparam name="S">The state to change to</typeparam>
  public void ChangeState<S>() where S : State {
    ChangeState(states[typeof(S)]);
  }

  /// <summary>
  /// Change to new state
  /// </summary>
  /// <typeparam name="S">The state to change to</typeparam>
  public void ChangeState(State state) {
    if (currentState != null) {
      currentState.OnExit();
    }
    currentState = state;
    currentState.OnEnter();
  }

  /// <summary>
  /// Changes to current state
  /// </summary>
  public void ChangeToDefault() {
    ChangeState(defaultState);
  }
}
```
This is the main orchestrator of the states and is to be the singular place we interface with the FSM framework.
The FSM has basic functionality including the ability to provide the current state, set a default one, and of course change the current state.

### State.cs
```csharp
/// <summary>
/// Models a state in a basic FSM
/// </summary>
public abstract class State {
  protected FiniteStateMachine fsm;
  protected PlayerController player;

  public State(FiniteStateMachine fsm, PlayerController player) {
    this.player = player;
    this.fsm = fsm;
  }

  /// <summary>
  /// What to do on entering the state
  /// </summary>
  public abstract void OnEnter();

  /// <summary>
  /// What to do on exiting the state
  /// </summary>
  public abstract void OnExit();

  public abstract void Update();
  public abstract void FixedUpdate();

  /// <summary>
  /// Goes to a new state (Wrapper for ChangeState)
  /// </summary>
  public void Goto<S>() where S : State {
    fsm.ChangeState<S>();
  }

  /// <summary>
  /// Changes to default
  /// </summary>
  public void GoToDefault() {
    fsm.ChangeToDefault();
  }
}
```
This is an abstract implementation of a single state in your FSM that allows you implement it's lifecycle hooks via inheritance. Along with the player it will also contain a reference to your FSM itself so that the states can easily request to change to another state. You'll notice that neither of these classes are extending from Unity's `MonoBehaviour` class, meaning they will not function as components you attach to your gameobjects. This will instead be used as a basic C# object that gets instantiated and has its lifecycle methods called via your `PlayerController`, below you can see an example of this. This method is simply a preference of mine as I quite enjoy the engine-agnostic aspect of this implementation.

I was interested in how this would look as a game object component so I went ahead and created one <a href="https://github.com/mbitzos/devblog-code-examples/tree/main/fsm-player-controllers/monobehaviour-example">here.</a>
In retrospect I think this approach is better for Unity specifically since `GetComponent` removes a lot of the boilerplate and lets us utilize Unity's serialization for state class variables. For my next project I'll be sure to try out this out to see how the two differ! 

The rest of the article is independent of this decision so don't fret if you decide to go with either implementation.

Another thing you'll notice is that my original definition of a FSM contains the concept of "states" and "transitions". By comparison, my implementation doesn't explicitly define transitions as I believe them to be redundant for the use case of player state management. The focus of the FSM implementation is to decouple player state from the controller, the transitions are hardly the focus here and were less important for my use-case as well. This solution provides a great balance of strict separation of states with the freedom of transition control.

## Example

Below is a barebones example of how I would implement a FSM for a player controller in an RPG.

```csharp
/// <summary>
/// Models a basic fsm for a player
/// </summary>
public class PlayerFSM : FiniteStateMachine {
  public PlayerFSM(PlayerController player) : base(player) {
    var defaultState = new DefaultState(this, player);
    var states = new List<State>() {
      defaultState,
      new DashState(this, player),
      new AttackState(this, player),
      new DeathState(this, player),
    };
    setStates(states, defaultState);
  }
}

/// <summary>
/// Default state to control the player
/// </summary>
public class DefaultState : State {
  public DefaultState(FiniteStateMachine fsm, PlayerController player) : base(fsm, player) { }

  public override void FixedUpdate() { }

  public override void OnEnter() { }

  public override void OnExit() { }

  public override void Update() {
    if (Input.GetKeyDown(KeyCode.Space)) {
      Goto<DashState>();
    }
    // handle basic player movement physics + animation
  }
}

/// <summary>
/// Models when the player is performing an attack 
/// </summary>
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

/// <summary>
/// Models the state when the player dashes
/// </summary>
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

/// <summary>
/// Models the state when the player is dead 
/// </summary>
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
```


## Beyond

There is a ton we can do to further improve our FSM framework, it's up to you whether these features could help in your use-case but I recommend all of these for those that want to take their technical skills to the next level.

### Utilizing Generics

The above design is strictly for our player controller, but what if we have other things in our game that want to utilize a FSM? One solution is that we could design a FSM that expects to pass in a `MonoBehaviour` object, but that would require us to cast it everywhere.

```csharp
public class ExampleState : State {
  public ExampleState(FiniteStateMachine fsm, Monobehaviour stateObject) : base(fsm, stateObject) {}
  public override void Update() {
    PlayerController player = stateObject as PlayerController; // :'(
    if (Input.GetKeyDown(KeyCode.Space)) {
      player.DoSomethingSpecificToPlayer();
    }
  }
}
```

This is where the beauty of C#'s generics comes in to help us design an object-agnostic FSM without the drawbacks mentioned above.
If you are new to generics I would suggest to first <a href="https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics">read up on generics via the official C# documentation.</a>

Essentially we change the definition of our FSM so that in our implementation of our states and FSM we can specify which type of `MonoBehaviour` we will be controlling. 

```csharp
/// <summary>
/// Models the finite state machine using generics
/// </summary>
/// <typeparam name="SO">[SO=State Object] This is the monobehaviour object that our FSM is controlling state for </typeparam>
public class FiniteStateMachine<SO> where SO : MonoBehaviour {

  Dictionary<Type, State<SO>> states = new Dictionary<Type, State<SO>>();

  public State<SO> currentState {
    get;
    private set;
  }
  State<SO> defaultState;

  // This is the object that our FSM is controlling state for
  private SO stateObject;

  /// <summary>
  /// Constructs a new finite state machine
  /// </summary>
  public FiniteStateMachine(SO stateObject) {
    this.stateObject = stateObject;
  }
  ...
}

/// <summary>
/// Models a state in an generic-powered FSM
/// </summary>
/// <typeparam name="SO">[SO=State Object] This is the object that our FSM is controlling state for </typeparam>
public abstract class State<SO> where SO : MonoBehaviour {
  protected FiniteStateMachine<SO> fsm;
  protected SO stateObject;

  public State(FiniteStateMachine<SO> fsm, SO stateObject) {
    this.stateObject = stateObject;
    this.fsm = fsm;
  }
  ...
}
```

From there you can see how easy it is to use the same FSM framework for different controllers.

```csharp

// FSM for player controller
#region Player
public class PlayerFSM : FiniteStateMachine<PlayerController> {
  public PlayerFSM(PlayerController player) : base(player) {
    // states
  }
}
public abstract class BasePlayerState : State<PlayerController> {
  protected BasePlayerState(PlayerFSM fsm, PlayerController player) : base(fsm, player) { }
}
public class DefaultState : BasePlayerState {
  public DefaultState(PlayerFSM fsm, PlayerController player) : base(fsm, player) { }
}

#endregion

// FSM for enemy controller
#region Enemy
public class EnemyFSM : FiniteStateMachine<EnemyController> {
  public EnemyFSM(EnemyController enemy) : base(enemy) {
    // states
  }
}
public abstract class BaseEnemyState : State<EnemyController> {
  protected BaseEnemyState(EnemyFSM fsm, EnemyController enemy) : base(fsm, enemy) { }
}
public class DefaultState : BaseEnemyState {
  public DefaultState(EnemyFSM fsm, EnemyController enemy) : base(fsm, enemy) { }
}
#endregion
```

### OnEnter Payload

One thing our original implementation lacks is the ability for our states to retrieve data via transitions. An example could be if you designed a knockback state for your player upon receiving damage and needed the specific attack data to control the physics behaviour of the hit.

We can accomplish this easily by introducing a "payload" parameter in our `ChangeState` methods that then gets passed to the State's `OnEnter` method. Here I am defining the payload as `object` and building a helper function to cast it. You could instead use a `Dictionary` if you prefer json-style data. 

```csharp
public class FiniteStateMachine {
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
  protected P CastPayload<P>(object payload, P defaultt = default(P)) {
    try {
      return (P) payload;
    } catch {
      return defaultt;
    }
  }
  ...
}

```

One drawback of this is that loosely defined data structures is prone to regression bugs. As a solo developer I never ran into issues but in an expanding team of developers one can see how bugs could arise if the payload or the payload cast was changed independently of one another. Unit tests would catch this, but I know none of us are writing those.

You could probably design a more robust payload system using generics but I have not attempted this yet since it was overkill for me.

### State priority

A more niche thing I've done before is introduce the concept of state priority such that during `ChangeState` the FSM will only ever change the current state if the next state's priority is greater. This is useful if you have many transitions into a single state that can occur under the same conditions. Instead of writing behaviour outside the FSM to decide if the state should be changed, this can easily be done in the FSM framework. To be honest I personally found this was mostly unused in my projects.

Here is what the FSM and State would look like:
```csharp
public class FiniteStateMachine {
  ...
  // now returns if the state changed successfully
  public bool ChangeState(State state) {
    if (currentState != null && currentState.priority > state.priority)
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
```

### Transition extras

Right now the implementation leaves states in the dark regarding why an outside transition occurred.

One useful thing we can do is allow our states to capture two pieces of information:
1. the next/previous state that is being changed to:

      a. The next/previous state is useful for specific use cases, but I would say that if this is needed more often than not it would probably be a better idea to go with a FSM framework that requires strictly defined transitions.

2. if this current state was interrupted:

    a. This can be very important because it lets a state define the difference between a graceful exit and a forceful one. It's ultimately better to design your states such that your `OnExit` cleans up the state regardless of how it's exited, but this solution offers a quick shortcut to solve applicable edgecases.

```csharp

// Models a FSM that has some extra transition data
public class FiniteStateMachine {
  ...
  /// <summary>
  /// Change to new state
  /// </summary>
  /// <param name="state"></param>
  /// <param name="source">The state that called for this change, default is null if the signal came from outside the FSM</param>
  /// <returns>if state change was successful</returns>
  public bool ChangeState(State state, State source = null) {
    if (currentState != null && currentState.priority > state.priority)
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
  /// <summary>
  /// What to do on entering the state
  /// </summary>
  public abstract void OnEnter(State previousState);

  /// <summary>
  /// What to do on exiting the state
  /// </summary>
  public abstract void OnExit(bool interrupted, State nextState);

  /// <summary>
  /// Goes to a new state (Wrapper for ChangeState)
  /// </summary>
  public void Goto<S>() where S : State {
    fsm.ChangeState<S>(this); // results in an uninterrupted exit
  }
  ...
}
```

## Lessons learned

1. Writing poorly designed mechanically dense states in a FSM will simply offload your problems from the Update loop. The FSM is a tool but unlocking its potential is being able to effectively break down your controller into decoupled states.
   
2. Decide early where you want to store your player model. It may seem obvious to have all of your player functions and properties in their respective state classes. However if those same functions need to be accessible from other places you should consider moving them to your PlayerController. One core rule of this FSM implementation is to never directly call functions and data in your state classes. If you do this you'll quickly understand that it's messy and is considered a failure in state design.

3. Don't be afraid to use your engine's tools, they're there to help you make games faster and easier. I personally learned while writing this article how the `MonoBehaviour` approach to my FSM implementation is superior as it provides more functionality with less boilerplate code.


## Conclusion

It is entirely possible to make a game with a single script for your player controller and it is not the determining factor for your games completion or success. Celeste is an example of a successful title <a href="https://github.com/NoelFB/Celeste/blob/master/Source/Player/Player.cs">that has a single 5400 lined player controller script,</a> but I have no doubt there were great difficulties revolving around this. While it is not the only or last example of this, every step we can make as developers to improve our technical skills will result in fewer times we are limited in creating the dream game we all desire to make. Using FSMs is but just one example of doing so by designing a robust player controller that allows you to develop easily understandable yet complex mechanics for your player while maintaining the integrity of your ever-expanding code.

All of the code examples in this article can be found <a href="https://github.com/mbitzos/devblog-code-examples/tree/main/fsm-player-controllers">here on my GitHub.</a>

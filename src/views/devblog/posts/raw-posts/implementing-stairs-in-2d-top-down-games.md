One of my favourite art styles for 2D games is one that use top-down perspective, more specifically, the <a href="https://tvtropes.org/pmwiki/pmwiki.php/Main/ThreeQuartersView#:~:text=A%20method%20of%20portraying%20three,indicates%20both%20height%20and%20depth." target="_blank">¾ top-down perspective.</a>

I will always love pixel art in general, but this perspective just brings me back to the days of playing old school Nintendo games on my handheld console of choice.

When I had the privilege of creating games with my good friend and amazing pixel artist <a href="https://www.artstation.com/pixelgrim" target="_blank">pixelgrim</a>, I was able to create games with this nostalgic perspective. There were a ton of new lessons learned along the way and I honestly could write many more articles just about my experiences working with pixel art within the Unity engine.

Today though, I will be going over something a bit more specific: how to implement satisfying feeling stairs in a 2D top-down game.

For the sake of simplicity, when I talk about "stairs", I am referring to any incline/decline slope your players can traverse in your levels. Stairs was my first application of this so the terminology just stuck.

When my team and I had begun working on a very ambitious open-world top-down pixel art RPG (I know, *very ambitious*), we got a chance to learn quite a bit about creating levels in a 2D world. One of the things we ran into was how you deal with a player walking up and down stairs in a ¾ top-down perspective. 

Given the thousands of other challenges that come with game development, you might be laughing at the fact that I'm writing an entire article about **stairs**. To your hypothetical condescending laughter, I counter with this:

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/bad-2d-stairs.gif", "subtitle":"Here we see a confused and troubled character skating within their torturous illusion they call a world."}

You see the problem here? Your character looks like they're gliding across a flat print out of your world, reminiscent of those carpets you may have had as a kid.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/nostalgia-carpet.jpeg"}

I hope at this point you've recognized this legitimate problem because I can assure you, as weird as this looks, it feels 10 times worse as the player.

The problem is actually very simple, we are emulating a 3D world with 2D art that does not actually have any concept of depth. The artist is drawing objects and levels that follow rules to give off the appearance of depth. If you are lucky to have a great artist, this can be extremely convincing, and very immersive when playing. Unfortunately, that immersion will quickly fade when your character moves in such a way that disobeys the artificial rules your art perspective is enforcing- something your artist carefully put time into perfecting.

There is basically two classification of problems I will go over in this article, both of which will be solved with a relatively short amount of code.

### Vertical Stairs

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/vertical-stairs.png", "subtitle":"\"Vertical\" in this case refers to the y-axis in your 2D games."}

When your player is traversing a set of stairs that go up and down, what is logically happening is that they are traversing the distance of the entire slope, not just the distance the camera sees. Due to the nature of the top-down perspective, your player is only seeing a portion of the true length of this. Depending on whether this is a true top-down or ¾ top-down perspective, that distance is skewed but the idea stays the same.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/camera-angles.png", "subtitle":"We can see here how in a top-down perspective the observed length isn\'t always equal to the \"real\" length the player traverses."}

Since this is being built in a 2D engine, you need to emulate this "extra" distance by applying tricks to your player's movement. When a player is moving up and down a flight of stairs, they should be slowed down to compensate for the extra distance that your camera physically cannot show to the player. The reason is pretty simple, if your character is moving at a constant speed but traversing a larger distance than the camera shows, than the speed must be lowered to compensate. What this does is help trick the player into believing that the stairs is on a different height than the rest of the ground, something the art is already attempting to reinforce, but is only possible to polish with the help of code.

Our goal is to create something that converts this:
$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/bad-vertical-stairs.gif", "subtitle": "Walking up a set of stairs gives no illusion of depth."}
To this:
$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/good-vertical-stairs.gif", "subtitle": "Slowing the player down when walking up the stairs makes it appear that they are actually moving upward."}

The solution I've gone with here is that we basically apply some arbitrary speed modifier impacting only the vertical portion of the movement. This triggers once they are detected to be walking on a set of stairs.

The interesting thing about ¾ top-down is that you can usually get away with some things that are not-so-accurate. You have quite a bit of leeway as to how you want to tweak this behaviour, so your modifiers don't necessarily have to be physically accurate, constant or the same going up a set of stairs versus down them.

One of the fun parts about being a game developer is that you get to make whatever you want. If something you design or implement doesn't "make sense", that doesn't mean it's a bad idea. I believe the execution of said ideas is what ultimately leads to creating fun experiences for your players. The main driving point of this article isn't to enforce realism, but to enforce a more consistent playing experience with the rest of the game. 

### Horizontal stairs

NOTE: This one only really applies to ¾ top-down and possibly isometrics, so for those making true top-down you can skip this.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/horizontal-stairs.png", "subtitle":"\"Horizontal\" refers to the x-axis in your 2D games."}

When a player is traversing a set of stairs that go left and right, logically speaking, they are also moving up and down the slope as well. Unlike vertical stairs, a ¾ perspective does not hide this at all. The one thing that doesn't work however, is how a player controls their character moving along these stairs. If the player is walking towards a set of stairs on their right and continues to only hold the input to move their character right, what ends up happening is that they unnaturally slide against the slope of the stairs. This goes directly against what perspective rules our art is attempting to enforce.  

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/really-bad-horizontal-stairs.gif", "subtitle": "By default, holding right will move the character as if it was just a typical flat piece of ground."}

The obvious thing your player would quickly do to combat this would be to input some vertical movement to compensate. So if I am walking up stairs on my right, my input would involve some form of a up-right diagonal input.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/bad-horizontal-stairs.gif", "subtitle": "Added UI to show current input, as you can see it\'s very awkward to traverse these as the player, especially on keyboard."}


#### Small rant

I know I'll probably have people disagree with me here, but I think the above doesn't feel or look good at all.

While I understand that your character is literally going in a diagonal direction, to me it feels unnatural to have to compensate for the game's lack of depth as the player via some movement input. Additionally, the art in the world is enforcing that that it has stairs that go upwards, the code should be helping enforce this.

For many 2D games, you have to introduce various tricks to convince your player of the "existence" of depth in your 2D world. Techniques like dynamic depth sorting and parallax all add to the experience that make you feel like your 2D character exists in a real 3D world.

I think that if your game does use these techniques, then addressing the above problem is essential. If you don't really condition your player to the concept of depth in your 2D game, than this is less important and I assume would not impact your player's experience as much.

#### The solution

Here's where things get a bit tricky.

We need to emulate this vertical input by applying some new vertical vector to the player's movement.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/good-horizontal-stairs.gif", "subtitle": "When we automatically add in the vertical movement, the player only needs to continue holding the same input."}

Essentially what is needed to be done is use the angle of the stairs to add or substract some value to the player's movement vector's `y` property. 

One thing that's really nice is that the same speed modifier logic that is needed for vertical stairs, is the same technique used for horizontal stairs as seen below.

### Putting it all together

With both of the vertical and horizontal stairs cases explained above we can now go over how this is easily done.

For detecting the stairs, we simply use Unity's 2D trigger system and keep a stack of the stairs the player is currently on. 
NOTE: I usually always use a stack for triggers because it helps with overlapping colliders.

Our stairs component will then be a simple MonoBehaviour that requires a `Collider2D` and defines the angle of our stairs via two points to form a 2D direction vector. We will then use the angle of the stair's direction to apply our speed modifiers to the necessary `x` and `y` properties as well as add or subtract to the movement's `y` property based on some calculation with `tan`.

Here is the completed implementation:

### Stairs.cs
```csharp
/// <summary>
/// Models a set of stairs that slows down the player when moving in direction
/// </summary>
[RequireComponent(typeof(Collider2D))]
public class Stairs : MonoBehaviour {

  [Range(0, 180)]
  public float Angle;

  /// <summary>
  /// Gets the direction of the stairs vector
  /// </summary>
  /// <returns></returns>
  public Vector2 GetDirection() {
    return Quaternion.AngleAxis(Angle, Vector3.forward) * Vector2.up;
  }

  /// <summary>
  /// Draws a line for us to easily tell which angle we are using for the horizontal stairs
  /// </summary>
  void OnDrawGizmosSelected() {
    Gizmos.color = Color.black;
    Vector2 direction = GetDirection();
    Vector2 origin = transform.position;
    Vector2 start = origin - direction.normalized * 0.5f;
    Vector2 end = origin + direction.normalized * 0.5f;
    Gizmos.DrawSphere(start, 0.03f);
    Gizmos.DrawSphere(end, 0.03f);
    Gizmos.DrawLine(start, end);
  }

  // Stairs entered
  void OnTriggerEnter2D(Collider2D other) {
    PlayerController player = other.gameObject.GetComponent<PlayerController>();
    if (player) {
      player.Stairs.Push(this);
    }
  }

  // Stairs exited
  void OnTriggerExit2D(Collider2D other) {
    PlayerController player = other.gameObject.GetComponent<PlayerController>();
    if (player) {
      player.Stairs.Pop();
    }
  }

}
```
### PlayerController.cs
```csharp
public class PlayerController : MonoBehaviour {

  // Lets us control exactly how much each axis is affected when moving with/against the stairs slope
  // NOTE: We can keep these equal if we want consistent speed modifiers for going up/down stairs, but allows us to tweak it if needed
  const float StairSlowDownXPos = 0.8f;
  const float StairSlowDownXNeg = 0.6f;
  const float StairSlowDownYPos = 0.8f;
  const float StairSlowDownYNeg = 0.6f;

  public Stack<Stairs> Stairs = new Stack<>();

  /// <summary>
  /// Function that controls the actual movement
  /// NOTE: implementation details are not important here
  /// </summary>
  /// <param name="direction"></param>
  /// <param name="speed"></param>
  public void Move(Vector2 direction, float speed) {
    Vector2 pos = transform.position;
    Vector2 newMovement = ApplyStairMovement(direction * speed);
    pos += newMovement;

    // set position
    SetPosition(pos);
  }

  /// <summary>
  /// Converts a vector to conform to the stair's angle
  /// </summary>
  /// <param name="movement"></param>
  /// <returns></returns>
  public Vector2 ApplyStairMovement(Vector2 movement) {

    // exit early
    if (Stairs.Count == 0) return movement;

    Stairs stairs = Stairs.Peek();
    Vector2 stairsDirection = stairs.GetDirection();

    // apply slows for vertical direction
    movement.y *= (Mathf.Sign(stairsDirection.y) == Mathf.Sign(movement.y)) ? StairSlowDownYNeg : StairSlowDownYPos;
    float originalLength = movement.magnitude;

    float angle = stairs.Angle;
    bool isVertical = angle == 0;

    // since we are using the range 0-180, we need to do some clean up in the angle here
    // I'm sure there is a cleaner way to do this, but it works so whatever.
    bool isRight = angle > 90;
    if (isRight) {
      angle = angle - 90;
    } else {
      angle = 90 - angle;
    }
    // calculate tan, negate based on the angle because of math
    float tan = -Mathf.Tan(angle * Mathf.Deg2Rad);
    if (isRight) {
      tan *= -1;
    }
    // For vertical stairs we need to override this to 0 since it will increase y infinitely when our angle is 0
    if (isVertical)
      tan = 0;

    // SPECIFIC CASE: Player walks diagonally down stairs
    // This results in the player not moving in the y direction (cancels out due to tan angle)
    // we allow them to move a bit because even though its "logically" correct, it feels restrictive.
    // This is a perfect example of not following exact realism for the sake of game-feel
    if (Mathf.Sign(stairsDirection.x) != Mathf.Sign(movement.x) && movement.y > 0) {
      tan /= 2;
    }
    // apply vector calc to y and normalize to maintain speed
    movement.y += movement.x * tan;
    movement = movement.normalized * originalLength;
    return movement;
  }
}
```

This is then used as a simple component we can add via our inspector, and with the help of gizmos, lets us visualize the angle so we can match it up with our art perfectly.

$IMAGE$:{"uri":"posts/implementing-stairs-in-2d-top-down-games/editor.gif"}

### Building for NPCs

If you are building a game with other NPCs that will be traversing the world, you may want to consider moving this movement logic to a base class that all movable objects can use. An easy way to ensure NPCs also follow the rules of stairs traversal. With that being said, you could also find an approach that strictly enforces stair movements at an AI level incase you wanted to keep this isolated to the player controller.


### Non-linear stairs

I am explicitly only covering stairs of a fixed angle, for my use cases there was no need to implement non-linear stairs/slopes for our levels. I could definitely see a solution that uses an `AnimationCurve` to provide the tangent of the slope at the specific point when calculating the new movement vector. I think though if I did run into rare cases that had that, I would end up just constructing it with some smaller linear slopes.

### Realism in games

Now before you heckle me about how games don't have to be realistic and this is entirely unnecessary, especially for 2D games with pixel art- let me just assure you that I fully appreciate un-realism. Games should not have to conform to the boring bounds of the real world, this is part of what makes them a fantastical experience. The realism is less important and more the consistency of the enforcement and applications of any rules you decide to put in place for your game. Whether that be through its art, sound, or gameplay. If you do choose to enforce rules, then you better be sure to enforce them well, because everytime you fail to do so, it deters from the immersion in your game and will definitely pile up over time.

### Conclusions

The idea of emulating depth is something that I'm sure those *privileged* 3D game developers never have had to worry about, but it definitely makes things interesting for us 2D gamedevs. I hope that you've been able to take something away from this article in some capacity, if you feel like you disagree with anything I've said, please don't hesitate to send me a disgruntled email or DM on reddit. I do enjoy hearing any feedback and I am always excited to chat about game development.

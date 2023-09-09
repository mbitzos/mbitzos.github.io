The idea of games saving my progress was something I had always taken for granted, I hadn't grown up playing games in the 80/90s when a console shutdown *usually* meant the erasure of all your game's progress. Luckily games have evolved way past the need for hardware additions to allow for persistence, and have become a mechanic in their own rite. I strictly grew up playing Nintendo titles until my mid-teens and one of the consistent design choices of these games (whether it was a limitation or an explicit decision- unsure), they all shared a classic style checkpoint save system. Simply put, unless you get to either a checkpoint in the level, or you haven't explicitly saved at a "save station", your progress since the last save would be lost forever. 

When I first played The Elder Scrolls: Skyrim, I was blown away with how the game allowed you to save/load whenever and wherever you pleased via some quick menu option. On PC it was as simple as pressing F5 to save instantly, so you didn't even need to open the menu up. I'm aware Skyrim was far from the first to do this, and this concept had existed many years before, but it was my first time experiencing myself. The concept of saving your game mid-attack in a boss battle was really foreign to me as a gamer that I quickly utilized. As a game that often... encouraged poor decisions, it was really appreciated to have that fallback- yes this is save scumming and no, I will not apologize for it.

As a naive teenager with minimal knowledge of software, I truly couldn't fathom how games managed this, especially larger games where it felt like there were millions of details needed to be captured. As I've grown up, learned, and tinkered more, that mystery has slowly started to reveal itself. Don't get me wrong, computers and software are powered by magic and it's always humbling to learn about how some things work even at a high level. As I have worked on games and built my own save and load systems, I hope to share the learnings with you all so that we can continue to slowly demystify game persistence.

I'm not going to act like I developed a persistence engine for a AAA game like Skyrim, but I do want to shed some light on how to accomplish this in a smaller scope- something that most of us indie gamedevs are suited to tackle. In this article I will go over how to utilize JSON serialization and clean interfaces to create an easy, and dynamic save & load system in your game to easily persist **any** game state.

### Background

#### Serialization

The concept of saving and loading is actually a real simple concept once you understand the idea of serialization/deserialization in the context of loading from disk (okay, it's not that simple once you get to the lower levels but lets keep this light). I'm not going to bother explaining this concept fully but heres a good contextual TLDR for today:

*Serialization is the process of converting your in-memory objects into bytes such that they can be read/written to disk, allowing them to "exist" even after program execution. Deserialization is conversely the process of taking those bytes from disk, and reconstructing the "same" objects in memory during run-time.*

$IMAGE$:{"uri":"posts/demystifying-game-persistence/serialization_diagram.png"}

You can start to see how this concept is the crux of saving/loading game state. At the end of the day, your game state is defined by a set of data structures in memory, and persisting them to keep state is just a matter of how you manage and integrate the serialization/deserialization of those objects.

#### JSON

Hopefully at this point you understand what saving/loading is at a top-level. Luckily for us developers, there has already been literal decades of work to abstract away the implementation details of how to get this going in your code. Through various protocols, data format standards, and a plethora of libraries across languages- saving in-memory data to disk and loading it back during application run time is possible in only a few lines!

For this article's solution we will be utilizing JSON to serialize/deserialize our game state (If you need a primer on JSON, google is your friend here). A popular alternative is binary serialization which comparatively uses less space and time. I personally prefer JSON due to the human readable nature of it- makes debugging a lot easier. With that being said, I'm sure systems that use binary serialization have some tooling to easily debug the save files, so I'm sure that's not an issue for larger games where the performance is crucial.

JSON libraries are plentiful within the C# ecosystem, but for our use cases we will be using <a href="https://www.newtonsoft.com/json" target="_blank">Newtonsoft's json serialization library</a> over the built-in Unity <a href="https://docs.unity3d.com/2020.1/Documentation/Manual/JSONSerialization.html" target="_blank">JsonUtility</a>. If you don't already know, Unity itself uses JsonUtility internally to persist your data in your editor. One of the biggest limitations of it, is its inability to serialize/deserialize a `Dictionary`, which as we will explore later, will be very important. Now I do want to point out that a dictionary can easily be represented as a list of serializable key value pairs, which is natively serializable by the Unity json library- but let's not reinvent the wheel here.


I'm going to avoid explaining how to use this library, there's tons of better in-depth tutorials that are a google search away. Here's an example article of how to get this installed in your Unity project: <a href="https://rehtse-studio.medium.com/made-with-unity-newtonsofts-json-net-b64236d59e76#:~:text=Getting%20Newtonsoft's%20Json.NET%20Package,json%20press%20Add%20and%20done." target="_blank">Made With Unity | Newtonsoft’s Json.NET</a>. In today's article I want to focus on the bigger picture, in short, we will simply use this with some data structures that dynamically store our game data in a JSON file.

### Technical solution

#### Persisting game state of many objects

When it comes to writing code to save your game, the solution drastically depends on how large in scope and how granular your saving mechanics need to be. If at the end of the day all you need is to store some basic variables, than stop reading this article- what I'm proposing is incredibly overkill for you. 

Although, if you are aiming to save a lot of objects and their game state, then you may be interested in a save system I developed back when I was working on an RPG prototype.

When I first started working on this project I just knew that when it came to persistence, I wasn't going to get away with hardcoded logic across the codebase to save everything- mostly for my own sanity. I needed to come up with a smart way to have objects define their own saving and loading strategies, and decouple this from some centralized saving framework. What came next was the design of my lightweight persistence engine, which was comprised of the following:
1. A common serializable data structure: `SaveData`.
2. An easy to use interface: `Saver` (in this implementation, specifically an abstract class).
3. A singleton manager: `SaveManager`.

#### Data structures

The data structures here are actually very simple, we have a `SaveData` serializable class that contains a mapping of scenes to another serializable class `SceneData`. This then contains a mapping of per object save data stored in yet another serializable class called `ObjectData`. Finally, our `ObjectData` class is simply a wrapper for another `Dictionary` that actually holds persisted properties for said object.

*NOTE: I have structured this such that a scene is an encapsulation of saved data, more notes on this towards the end in the "further thoughts and reflection" section.*

```csharp
/// <summary>
/// Holds the save data for the game
/// </summary>
[Serializable]
public class SaveData {

  // Scene specific data
  public Dictionary<int, SceneData> scenes = new Dictionary<int, SceneData>();

  // unique ID of this save file
  public string ID { get; private set;};

  public SaveData() {
    ID = Guid.NewGuid().ToString();
  }

  /// <summary>
  /// Gets the scene data for this save file 
  /// </summary>
  /// <param name="sceneName"></param>
  /// <param name="objectId"></param>
  /// <typeparam name="T"></typeparam>
  /// <returns></returns>
  public object GetSceneObjectData<T>(int sceneIndex, string objectId) {
    return scenes.GetValueOrDefault(sceneIndex, null)?.GetObjectData<T>(objectId);
  }
}

/// <summary>
/// Holds save data for a scene in the game
/// </summary>
[Serializable]
public class SceneData {

  // saved objects in this scene
  public Dictionary<string, ObjectData> objects = new Dictionary<string, ObjectData>();

  /// <summary>
  /// Gets the object data for this scene
  /// </summary>
  /// <param name="objectId"></param>
  /// <typeparam name="T"></typeparam>
  /// <returns></returns>
  public object GetObjectData<T>(string objectId) {
    return objects.GetValueOrDefault(objectId, null);
  }
}

/// <summary>
/// Holds save data for a game object in a scene in a game
/// </summary>
[Serializable]
public class ObjectData {

  // properties of this object to save/load
  public Dictionary<string, object> properties = new Dictionary<string, object>();

  public ObjectData(Dictionary<string, object> properties) {
    this.properties = properties;
  }

  /// <summary>
  /// Gets the property from this object data
  /// </summary>
  /// <param name="propertyName"></param>
  /// <param name="defaultValue"></param>
  /// <typeparam name="T"></typeparam>
  /// <returns></returns>
  public T Get<T>(string propertyName, T defaultValue) {
    return (T) properties.GetValueOrDefault(propertyName, defaultValue);
  }
}
```
When this gets serialized we can get something that may look like this as an example:

```json
{
  "id": "219ed9e4-d55a-4d88-839d-2aee35b3e9fd",
  "scenes": {
    "0": {
      "objects": {
        "main_player": {
          "properties": {
            "maxHP": 100,
            "currentHP": 100,
            "position.x": -11.122,
            "position.y": 10.1231
          }
        },
        "door_1": {
          "properties": {
            "open": true
          }
        },
        "enemy_1": {
          "properties": {
            "isAlive": true,
            "currentHP": 10
          }
        }
      }
    }
  }
}
```
As mentioned before, JSON is especially nice to debug, it's easy to tell within a few seconds what the game state we've captured is.

#### Saver abstract class

Now that we have the concept of how our data is stored, we can now define how this data is actually used. We introduce the concept of a very simple  `Saver` abstract class, that lets us define two behaviours:

1. Providing the game state data to store in the save file for this object via an `ObjectData` instance.
2. Providing the logic for how this object's state is initialized during load via that same `ObjectData` instance reconstructed from disk.

```csharp
/// <summary>
/// Models an object that defines its save/load behaviour
/// </summary>
public abstract class Saver : MonoBehaviour {

  [Tooltip("The order we want to save this object in, in the range from [-inf, inf].")]
  public int SavePriority = 0;
  [Tooltip("The order we want to load this object in, in the range from [-inf, inf].")]
  public int LoadPriority = 0;

  // Unique ID to map the saved data in disk to the object in memory, TODO: generate this via UnityEditor
  public string SaveId;

  /// <summary>
  /// Returns the persisted save data for this object
  /// aka Serialization
  /// </summary>
  /// <returns></returns>
  public abstract ObjectData Save();

  /// <summary>
  /// Loads the object with the save data for this Saver
  /// aka Deserialization
  /// </summary>
  /// <param name="data"></param>
  public abstract void Load(ObjectData data);

}
```

An concrete example of how one could save some main player properties is as follows:

```csharp
public class MainPlayerSaver: Saver {

  // set from editor
  public MainPlayer mainCharacter;

  // load maxHP, currentHP
  public void Load(ObjectData data) {
    this.mainCharacter.maxHP = data.Get<int>("maxHP");
    this.mainCharacter.currentHP = data.Get<int>("currentHP");
  }

  // Save maxHP, currentHP
  public ObjectData Save() {
    return ObjectData(new Dictionary<string, object>() {
      {"maxHP", this.mainCharacter.maxHP},
      {"currentHP", this.mainCharacter.currentHP},
    });
  }
}
```

One of the neat things about this is that because these are components, you can easily create re-usable savers to be used across different objects (ex: `TransformSaver`, `AnimationSaver`). As long as they have different `SaverId` there shouldn't be a problem.

Another great thing is that a `Saver` can be used in such a way that doesn't necessarily have to be responsible for a single object. Let's say you need to keep track of objects that are created during the lifetime of your game. You could easily create a `Saver` class that is responsible for saving how many objects were created and their configurations such that during game load, you can spawn back those objects. For example if you were creating a game with some sort of building mechanic, you could write a single `Saver` that keeps track of all player created structures and their placement.

#### Note about SaveId

In the `Saver`, the `SaveId` is required to be filled out by yourself in the editor, and given that this needs to be unique, it runs the risk of key conflicts in your save file. An easy alternative is hiding `SaveId` and instead auto generating with an editor script that creates a unique UUID string upon object creation. This is needed to be done as an editor script because there is actually no API that exposes a persistable ID for your objects, no- `GetInstanceID` does not work, it even says so in the <a href="https://docs.unity3d.com/ScriptReference/Object.GetInstanceID.html" target="_blank">docs</a>. Heres an example reddit post I found with code that accomplishes this via an editor PropertyDrawer script: <a href="https://www.reddit.com/r/Unity3D/comments/fdc2on/easily_generate_unique_ids_for_your_game_objects/" target="_blank">Easily generate unique IDs for your game objects</a>- I've done something similar and can confirm this is a great alternative worth implementing.

#### Save Manager

Now that we have our data, and our interfaces for that data, all we have to do is define a manager to piece it all together during the actual save/load.

During save, the `SaveManager` basically does this:
1. Get all `Saver` objects via `FindObjectsOfType<Saver>()`.
2. Get the existing save file and deserialize it as `SaveData`, or create a new `SaveData` if it doesn't exist.
3. Get the current scene build index and construct a `SceneData` object.
4. For each `Saver`, call `.Save()` and store the `ObjectData` returned on the `SceneData.objects` dictionary using their `SaveId` as the key.
5. Overwrite/add the `SaveData.scenes[currentSceneIndex]` with the new `SceneData`.
6. Serialize and write the `SavaData` object to disk.

$IMAGE$:{"uri":"posts/demystifying-game-persistence/save_diagram.png"}

During load, the `SaveManager` does something similar:
1. Fetch the save file via ID (if we are loading the latest, we will just fetch the latest ID stored using PlayerPrefs).
2. Load the save file, and deserialize the `SaveData` from the file.
3. Get the `SceneData` from `SaveData.scenes[currentSceneIndex]`.
4. Get all `Saver` objects and call `.load` with its associated `ObjectData` found in `SceneData.objects` using the same `SaveId`.

$IMAGE$:{"uri":"posts/demystifying-game-persistence/load_diagram.png"}

As we can see, it's actually quite simple once you abstract everything into their own components.

Heres the code:

```csharp
/// <summary>
/// Manager for saving and loading game data
/// This currently uses PlayerPrefs for storing the current save file, this would most likely be migrated to a different system later.
/// NOTE: We could utilize instead a pub/sub style of saving, but this is simpler for now and allows us to have sort priority handled by the manager.
/// NOTE: This manager also handles UI for saving and loading, which should be decoupled later.
/// NOTE: This manager has coroutines as a first class citizen by ensuring all file IO is kept off the main thread and yielded in the main enumerator.
/// </summary>
public class SaveManager : MonoBehaviour {

  const string SAVE_EXTENSION = ".save";
  const string LAST_SAVE_KEY = "lastsave";

  /// <summary>
  /// get all savers in the scene in order
  /// NOTE: We could easily change this to instead have savers subscribe themselves to the SaveManager
  /// </summary>
  /// <returns></returns>
  private Saver[] getAllSavers() {
    return UnityEngine.Object.FindObjectsOfType<Saver>();
  }

  /// <summary>
  /// Saves the current scene
  /// NOTE: This combines new save create and saving, which should eventually be decoupled
  /// </summary>
  public IEnumerator Save() {
    Debug.Log("Saving...");
    Saver[] savers = getAllSavers();
    SaveData existingSave = null;
    yield return getOrCreateExistingSaveData(s => { existingSave = s; });

    // save all objects to existing save in their own tasks
    SceneData sceneData = new SceneData();
    savers.ToList().ForEach(saver => {
      sceneData.objects[saver.SaveId] = saver.Save();
    });
    int currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
    existingSave.scenes[currentSceneIndex] = sceneData;
    yield return saveFile(existingSave);
    Debug.Log("Saving completed.");
  }

  /// <summary>
  /// Loads the latest save file, throws an exception if none exists
  /// </summary>
  public IEnumerator LoadLatest() {
    if (!HasLastSaveFile()) {
      throw new MissingSaveFileException("No save file exists");
    }
    yield return Load(PlayerPrefs.GetString(LAST_SAVE_KEY));
  }

  /// <summary>
  /// Loads the save file for the current scene 
  /// </summary>
  public IEnumerator Load(string saveId) {
    Debug.Log($"Loading save {saveId}");
    int currentSceneIndex = SceneManager.GetActiveScene().buildIndex;
    SaveData saveData = null;
    yield return fetchSaveFile(saveId, s => { saveData = s; });
    if (!saveData.scenes.ContainsKey(currentSceneIndex)) {
      yield break;
    }
    SceneData sceneData = saveData.scenes[currentSceneIndex];

    // load persisted data into savers
    getAllSavers()
      .OrderBy(saver => saver.LoadPriority).ToList()
      .ForEach((Saver saver) => {
        if (sceneData.objects.ContainsKey(saver.SaveId)) {
          saver.Load(sceneData.objects[saver.SaveId]);
        };
      });
    Debug.Log("Loading completed.");
  }

  /// <summary>
  /// Save data to file
  /// </summary>
  private IEnumerator saveFile(SaveData data) {
    // set the current scene
    string jsonSaveData = JsonConvert.SerializeObject(data);
    string filepath = (Application.persistentDataPath + "/" + data.ID + SAVE_EXTENSION);
    yield return TaskUtils.YieldTask(File.WriteAllTextAsync(filepath, jsonSaveData));

    // currently uses player prefs...might change
    PlayerPrefs.SetString(LAST_SAVE_KEY, data.ID);
    PlayerPrefs.Save();
  }

  /// <summary>
  /// If the game has an existing game file
  /// </summary>
  /// <returns></returns>
  public bool HasLastSaveFile() {
    return PlayerPrefs.HasKey(LAST_SAVE_KEY);
  }

  /// <summary>
  /// Loads the last saved file, if none exists, create one
  /// </summary>
  public IEnumerator getOrCreateExistingSaveData(Action<SaveData> callback) {
    if (HasLastSaveFile()) {
      yield return fetchSaveFile(PlayerPrefs.GetString(LAST_SAVE_KEY), callback);
    } else {
      yield return null;
      callback(new SaveData());
    }
  }

  /// <summary>
  /// fetch the save file
  /// </summary>
  /// <param name="id">The ID of the load file</param>
  private IEnumerator fetchSaveFile(string id, Action<SaveData> callback) {
    // check if exists
    string saveFilePath = Application.persistentDataPath + "/" + id + SAVE_EXTENSION;
    Debug.Log($"Fetching save file {saveFilePath}");
    if (!File.Exists(saveFilePath)) {
      throw new MissingSaveFileException("No save file exists");
    }
    Task<string> task = File.ReadAllTextAsync(saveFilePath);
    yield return TaskUtils.YieldTask(task)
    SaveData data = JsonConvert.DeserializeObject<SaveData>(task.Result);
    callback(data);
  }
}
```


$IMAGE$:{"uri":"posts/demystifying-game-persistence/architecture_diagram.png", "subtitle": "A visual interpretation of the components in the persistence engine and their relationships."}

#### IEnumerator?

Throughout the `SaveManager` you'll notice that almost everything returns a `IEnumerator`. For those familiar with Unity you'll recognize these as methods that can be yielded within a Coroutine. The reason for this is that the concept of saving and loading inherently needs to use file IO, or a network connection if stored on the cloud, both of which are both applicable operations to do asynchronously off the main thread.

Now before you nit-pickers complain to me about my use of the word "async": **Yes. I am aware that coroutines are not asynchronous**. Given that, when we do something like `File.WriteAllTextAsync` that actually gets pushed off the main thread, we can use a nifty homebrewed `YieldTask` method that simply yields until the async task is completed. For example: it's best practice to show the player a loading icon/screen when a save/load is happening. This system lets you do this easily since coroutines make writing the kind of control flow a breeze. The alternative is that we don't bother with coroutines, use synchronous IO methods and run the risk of having the player frame rate hiccup during our saving/loading, which I think should be avoided even for small delays.

```csharp
public static class TaskUtils {
  /// <summary>
  /// Helper to yield on task completion
  /// TODO handle task errors
  /// </summary>
  /// <param name="task"></param>
  /// <returns></returns>
  public static IEnumerator YieldTask(Task task) {
    yield return new WaitUntil(() => task.IsCompleted);
  }
}

// Example that yield a coroutine until the async file write is done:
// yield return TaskUtils.YieldTask(File.WriteAllTextAsync(filepath, jsonSaveData));
```

### Further thoughts and reflection

As much as I appreciate the simplicity of this solution, unfortunately this does result in some limitations that will require you to further tweak this based on your own specific requirements. Here are a couple thoughts of reflection having looked back on this solution:

- Modelling save data per scene may not always make sense if you are developing a game where your world is loaded in chunks within a single large scene.
     - I personally think that the same encapsulation for which you save and load should be the same as how you plan to structure your levels. Although I could definitely see there being a case for a game that loads the entire game's save data into memory when the game first starts.
- A single large save file is inefficient for large games.
     - If you imagine an open-world game with possibly megabytes worth of save data, it may make more sense to have your save file written to in chunks. This means that instead of loading an entire save file, deserializing it, and then writing back to it. It may make more sense to instead have your save files split across many files, in our solution that could mean having a save file per scene. This results in fast writes, and potentially slower reads if we have to load all files together, which is fine given that players will load far less than they will save.
- `FindAllObjectsOfType` is pretty slow for larger scenes.
     - If your savers are never dynamically created, then you can get away with pre-fetching and storing references to those savers during compile time, instead of during application run time. This can be done during some automated step in the build, or as simple as an automated editor script.
- Saving all `Saver` objects is inefficient when not much of your game has changed state. 
     - Instead of naively saving every object in the context of your save, it actually makes more sense for our system to detect changes and only save the objects that were changed since last save (this concept is also referred to as dirty objects). This could easily be implemented in a ton of different ways, here's some ideas off the top of my head:
        - Update `Saver` to allow developers to define their persisted properties at the class level, and use those to not only save/load, but detect changes in those properties. This could easily be a hidden detail that a specific implementation of `Saver` does not need to worry about. 
        - Add a `IsDirty()` method to `Saver` that lets you define when an object is ready to be saved. This could also be added in the above idea for overrides.
        - Change our `SaveManager` to work as a pub/sub system such that our `Saver`'s will be responsible for emitting an event to the manager when it has detected a change, i.e to mark itself as dirty. This also removes the need for `FindAllObjectsOfType` during our save operation since the manager will now be given the references to objects that need to be saved.

### Conclusion

Hopefully after reading through this article, the mystery of how games store their data becomes a bit more obtainable for you to implement. With my given solution we also have the added benefit of developing a framework such that implementing a new type of saving, requires no updates to the core saving framework. It's as simple as implementing a new `Saver`, which as mentioned before lends itself to creating reusable save components. As with many of my articles, my aim as a software engineer in this devblog is to help you make games easier so that you can spend more time working on the fun content.

As mentioned in the previous section, I personally still have a lot to learn and try out. Each game requires it's own set of specific features and implementations. I'm excited to work on a new project that can test this design and push myself to explore new and creative options. Who knows, maybe I'll have part two of this article in the future.



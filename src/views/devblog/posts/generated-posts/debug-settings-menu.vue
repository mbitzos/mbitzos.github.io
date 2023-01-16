<template>
  <div>
    <p>
      One of the strategies my team and I practiced was to have weekly meetings
      to discuss the current state of our game. In these meetings we would plan
      out our roadmap, work on new designs, as well as review the past week's
      progress and the latest round of play-testing. This worked out well for
      the most part but the play-testing suffered from a serious problem
      limiting the speed at which we could progress. Since there was only one
      other programmer in our team, the rest of the members would rely on myself
      to create a build for them to test the game every time we decided to tweak
      a feature.
    </p>
    <ul>
      <li><p>Should we increase the maximum health of an enemy?</p></li>
      <li>
        <p>
          Is the dash in our game better if it's behaviour is more like X
          instead of Y?
        </p>
      </li>
      <li><p>Does the cool-down of a spell make it overpowered?</p></li>
    </ul>
    <p>
      All of these questions would begin as discussions but could only be
      concluded once I pushed a change, built the latest version, uploaded it,
      and then had the team go through a round of review again. Not only was
      this cumbersome to me as a developer, it limited how fast and efficient we
      as a team could operate. Additionally, being one of two developers who
      could modify the game directly via the code/engine, it intrinsically
      limited how other team members could offer feedback. Overall, it took us
      more rounds of review to decide which direction a feature was headed.
    </p>
    <p>
      This lasted until I decided to pursue an alternative where non-programmers
      could modify the game themselves in an intuitive way during testing. From
      there I began to implement the idea of an interactive debug menu
      accessible during run-time.
    </p>
    <h2 id="thedebugmenu">The debug menu</h2>
    <p>
      This idea is far from original, but there is a reason why a vast majority
      of games during development utilize some form of a debug-mode or console.
      It simply allows a team to modify the game during run-time without having
      to change the code and make a build. Imagine if every time you as a player
      wanted to update the settings in a game (such as quality, controls, etc)
      you would have to modify a .txt file and restart the game. While not a
      exact 1-to-1 parallel, the idea is more or less the same for playtesters
      and developers. What I ended up creating for my team was a debug UI in our
      game that allowed us to modify properties and behaviours of the game while
      playing it, as well as saving these configurations to share.
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/debug-settings-menu/debug-menu.gif',
          subtitle:
            'The debug settings menu for our rhythm based beat-em-up roguelike. Pictured is some example settings we could tweak such as player HP, music/beat modifications, and level generation.'
        }"
      />
    </p>
    <p>
      This became an extremely powerful tool for our team during play-testing
      where each member could precisely tweak the game to what they believed was
      the best experience. During our meetings we would then review others
      configurations which offered a better perspective into their feedback. It
      allowed us to understand our new and existing features as well as their
      impacts on the game constantly.
    </p>
    <h2 id="implementation">Implementation</h2>
    <p>
      <em
        >NOTE: There is a ton of different ways this could be accomplished and
        by no means is my approach the best. At the time it worked well for my
        team and I but the purpose of this article is more to show how easy it
        can be added to quickly benefit a small team. In the "Afterword" section
        I touch on this a bit more.</em
      >
    </p>
    <p>
      The concept behind the debug menu is actually very simple. Using an UI
      input control (Text, Number, Dropdown, Slider etc), create an
      <code>OnChange</code> event to sync the UI value of the control to your
      choice of any Monobehaviour's serializable property. In an oversimplified
      way this is similar to how the inspector allows you to update a script's
      variable at run-time. Luckily Unity comes out of the box with these UI
      input field components so most of the work is just writing some simple
      code to perform the syncing.
    </p>
    <h3 id="syncing">Syncing</h3>
    <p>
      Syncing a variable was done with the following abstract script utilizing
      C#'s
      <a
        href="https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/reflection"
        target="_blank"
        >reflection framework</a
      >
      to allow for dynamic property fetching and setting.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models a settings control
/// &lt;/summary&gt;
public abstract class SettingsControl : MonoBehaviour {

  // The script we are targetting
  public MonoBehaviour script;

  // the parameter on the script we are targetting
  private string parameter;

  // if this parameter requires a soft game reload
  public bool RequiresRestart;

  // Overrides the label we display on the UI
  public string CustomLabel;

  // the initial value of the script's parameter
  protected object initial;

  private FieldInfo field;
  private PropertyInfo property;

  void Awake() {
    parameter = gameObject.name;

    // set the UI label
    Text text = transform.Find("label").GetComponent&lt;Text&gt;();
    text.text = CustomLabel == "" ? parameter : CustomLabel;
    if (RequiresRestart)
      text.text = text.text + "**";
  }

  protected virtual void Start() {
    try {
      this.field = getField();
      this.property = getProperty();
      this.initial = this.field != null ? this.field.GetValue(script) : this.property.GetValue(script);
    } catch (Exception e) {
      Debug.Log(String.Format("Problem with setting control: {0}.{1}", script.GetType(), parameter));
      Debug.LogException(e);
    }
  }

  /// &lt;summary&gt;
  /// Syncs the UI value to the script's property
  /// &lt;/summary&gt;
  /// &lt;param name="val"&gt;&lt;/param&gt;
  protected virtual void Sync(object val) {

    //find the type
    Type type = field != null ? field.FieldType : property.PropertyType;

    // Convert.ChangeType does not handle conversion to nullable types
    // if the property type is nullable, we need to get the underlying type of the property
    var targetType = IsNullableType(type) ? Nullable.GetUnderlyingType(type) : type;

    // Returns an System.Object with the specified System.Type and whose value is
    // equivalent to the specified object.
    val = Convert.ChangeType(val, targetType);

    if (field != null)
      field.SetValue(this.script, val);
    else {;
      property.SetValue(this.script, val);
    }
  }
  /// &lt;summary&gt;
  /// checks if nullable for property reflection
  /// &lt;/summary&gt;
  /// &lt;param name="type"&gt;&lt;/param&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  private static bool IsNullableType(Type type) {
    return type.IsGenericType &amp;&amp; type.GetGenericTypeDefinition().Equals(typeof(Nullable&lt;&gt;));
  }

  /// &lt;summary&gt;
  /// Gets the value from this UI control
  /// &lt;/summary&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  protected abstract string GetValue();

  /// &lt;summary&gt;
  /// Uses reflection to get script field
  /// &lt;/summary&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  protected FieldInfo getField() {
    Type type = script.GetType();
    return type.GetField(parameter);
  }

  /// &lt;summary&gt;
  /// Uses reflection to get script property
  /// &lt;/summary&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  protected PropertyInfo getProperty() {
    Type type = script.GetType();
    return type.GetProperty(parameter);
  }
}
</code></pre>
    </CodeBlock>
    <p>From there we create input specific implementations:</p>
    <h4 id="textboxstring">Textbox/String</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Models a textbox that allows for string settings
/// &lt;/summary&gt;
public class SettingsTextBox : SettingsControl {
  public TMP_InputField inputField;

  public int DecimalPlaces = 2;

  protected override void Start() {
    base.Start();

    // sync on input
    inputField.onValueChanged.AddListener(val =&gt; {
      Sync(val);
    });
  }

  protected override string GetValue() {
    return inputField.text;
  }
}
</code></pre>
    </CodeBlock>
    <h4 id="checkboxbool">Checkbox/Bool</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Control to sync boolean properties with a checkbox 
/// &lt;/summary&gt;
public class SettingsCheckbox : SettingsControl {

  [SerializeField]
  Toggle toggle;

  protected override void Start() {
    base.Start();

    // sync on toggle
    toggle.onValueChanged.AddListener(val =&gt; {
      Sync(val);
    });
  }

  protected override void Sync(object val) {
    base.Sync(val);
    toggle.isOn = val.GetType() == typeof(string) ? bool.Parse((string) val) : ((bool) val);
  }

  protected override string GetValue() {
    return toggle.isOn.ToString();
  }
}
</code></pre>
    </CodeBlock>
    <h4 id="slidernumber">Slider/Number</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Control to sync a number (int or decimal) to a slider component
/// &lt;/summary&gt;
public class SettingsSlider : SettingsControl {
  public Slider slider;
  public Text textvalue;

  public int DecimalPlaces = 2;

  protected override void Start() {
    base.Start();

    // sync on slide
    slider.onValueChanged.AddListener(val =&gt; {
      Sync(val);
    });
  }

  protected override void Sync(object val) {
    base.Sync(val);

    // slider precision
    if (slider.wholeNumbers) {
      int vall = Convert.ToInt32(val);
      slider.value = vall;
      textvalue.text = vall.ToString();
    } else {
      float vall = val.GetType() == typeof(string) ? float.Parse((string) val) : ((float) val);
      slider.value = vall;
      textvalue.text = Math.Round(vall, DecimalPlaces).ToString();
    }
  }

  protected override string GetValue() {
    return slider.value.ToString();
  }
}
</code></pre>
    </CodeBlock>
    <h4 id="dropdownenum">Dropdown/Enum</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Setting controls for Enums, values are matched to the order not the value
/// &lt;/summary&gt;
public class SettingsDropdown : SettingsControl {

  [SerializeField]
  TMP_Dropdown dropdown;

  protected override void Start() {
    base.Start();

    setOptions();

    // sync on select
    dropdown.onValueChanged.AddListener(val =&gt; {
      Sync(val);
    });
  }

  protected virtual void setOptions() {
    Type enumType = initial.GetType();
    dropdown.options = Enum.GetNames(enumType).Select(name =&gt; new TMP_Dropdown.OptionData(name)).ToList();
  }

  protected override void Sync(object val) {
    var enumValue = Enum.Parse(initial.GetType(), val.ToString());
    base.Sync(enumValue);
    dropdown.value = (int) enumValue;
  }

  protected override string GetValue() {
    return dropdown.value.ToString();
  }
}
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/debug-settings-menu/prefabs.gif',
          subtitle:
            'Creating prefabs for these controls made it trivial to add new settings to my menu.'
        }"
      />
    </p>
    <p>
      One niche approach I did for my sake was that I used the prefab's
      gameobject <code>name</code> property to be the name of the property I
      want to sync with on the Monobehaviour provided in <code>script</code>.
      This worked in my use-case as I originally was naming my gameobjects their
      corresponding properties anyways for better readability. Another feature I
      added was creating a Unity menu action item to sync my gameobject's names
      to the UI text label, another time saver specific to my use-case because I
      hate writing things twice. In hindsight this probably could have been done
      automatically when updating the gameobject's name in the editor.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">/// &lt;summary&gt;
/// Syncs settings label in editor
/// Just nice because it syncs during runtime, but can be confusing when editing
/// &lt;/summary&gt;
[MenuItem("BeatBash/Sync Settings Labels")]
static void SyncSettingsLabel() {

  SettingsControl[] settings = Camera.main.GetComponentsInChildren&lt;SettingsControl&gt;();
  foreach (SettingsControl control in settings) {
    Transform label = control.transform.Find("label");
    string labelText = control.CustomLabel != "" ? control.CustomLabel : control.gameObject.name;
    Text text = label.GetComponent&lt;Text&gt;();
    text.text = labelText;
    EditorUtility.SetDirty(text);
  }
}
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/debug-settings-menu/label-sync.gif',
          subtitle: 'Shows how label syncing worked within my editor.'
        }"
      />
    </p>
    <h3 id="persistence">Persistence</h3>
    <p>
      The first iteration of my debug menu didn't have any persistence, which
      meant that all of the settings that play testers changed, would be lost
      upon game reset. Obviously this makes the usability of this framework
      pretty terrible and kind of defeats the purpose of overall trying to
      improve our process.
    </p>
    <p>
      To really make this useful I implemented saving/loading such that all of
      the game settings could be persisted to a <code>.json</code> settings file
      on the testers local machine. This could then easily be shared on our
      discord server and loaded for others to try out.
    </p>
    <p>An example settings file would look like this:</p>
    <CodeBlock>
      <pre><code class="json language-json">{
  "settings": [
    {
      "Key": "LevelManager (LevelManager):Seed",
      "Value": ""
    },
    {
      "Key": "LevelManager (LevelManager):Gridsize",
      "Value": "10"
    },
    {
      "Key": "LevelManager (LevelManager):TotalRooms",
      "Value": "15"
    }
  ]
}
</code></pre>
    </CodeBlock>
    <p>
      This was similarly built to a lot of save systems out there that utilize
      json serialization to convert a C# class into a json file and vice versa.
      In our case the only thing we need to persist was the value of our
      <code>SettingsControl</code> scripts. I introduced the concept of a
      <code>SettingsModule</code> which was a singleton to collect all
      <code>SettingControl's</code> for serialization/deserialization. From
      there it was as simple as creating a list of key-value-pairs such that the
      unique key was formed via <code>SCRIPT_NAME:PARAMETER</code> format and
      the value was fetched using an override <code>GetValue</code> method to
      allow controls to fetch their UI input fields deserialized value. From
      there we can create a <code>GameSettings</code> class to be our main
      orchestrator for the saving/loading. We then have a
      <code>GameSettingsRaw</code> class to hold all of the settings for
      serialization since I always prefer to do this over storing raw
      lists/dictionary data for scalability.
    </p>
    <p>
      <em
        >NOTE: I used JSON serialization instead of the more efficient binary
        serialization. I preferred the human readable nature of json and the
        performance was not an important factor for this.</em
      >
    </p>
    <h4 id="gamesettingscs">GameSettings.cs</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public class GameSettings : MonoBehaviour {
  public GameObject Settings;
  private SettingsModule[] settings;

  private string SettingsFilePathDirectory {
    get {
      return Application.streamingAssetsPath + "/Settings";
    }
  }
  private string SettingsFilePath {
    get {
      return SettingsFilePathDirectory + "/settings.json";
    }
  }

  void Awake() {
    settings = GetComponentsInChildren&lt;SettingsModule&gt;();
  }

  void Start() {
    // init director if not exists
    if (!Directory.Exists(SettingsFilePathDirectory)) {
      Directory.CreateDirectory(SettingsFilePathDirectory);
    }
    Reset();
  }

  /// &lt;summary&gt;
  /// Saves current settings to disk
  /// &lt;/summary&gt;
  public void Save() {
    Dictionary&lt;string, string&gt; data = new Dictionary&lt;string, string&gt;();
    foreach (var module in settings)
      data.AddAll(module.Save());

    // write to file
    string json = JsonUtility.ToJson(new GameSettingsRaw(data), prettyPrint : true);
    File.WriteAllText(SettingsFilePath, json);
  }

  /// &lt;summary&gt;
  /// Loads a settings file to disk
  /// &lt;/summary&gt;
  public void Load() {
    // loads the file if it exists
    if (File.Exists(SettingsFilePath))
      Reset();
  }

  /// &lt;summary&gt;
  /// deletes current cached save
  /// &lt;/summary&gt;
  public void ResetToDefault() {
    Reset(true);
  }

  /// &lt;summary&gt;
  /// Loads initial settings
  /// &lt;/summary&gt;
  public void Reset(bool useDefaults = false) {
    // load initial
    var currentSettings = getCurrentSettingsFile();
    if (useDefaults)
      currentSettings = null;
    foreach (var module in settings) {
      module.Load(currentSettings);
    }
  }

  /// &lt;summary&gt;
  /// Gets the currentSettings file if it exists
  /// &lt;/summary&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  private Dictionary&lt;string, string&gt; getCurrentSettingsFile() {
    if (File.Exists(SettingsFilePath)) {
      GameSettingsRaw raw = JsonUtility.FromJson&lt;GameSettingsRaw&gt;(File.ReadAllText(SettingsFilePath));
      if (raw != null) return raw.GetSettings();
    }
    return null;
  }
}
</code></pre>
    </CodeBlock>
    <h4 id="settingsmodulecs">SettingsModule.cs</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public class SettingsModule : MonoBehaviour {
  SettingsControl[] Controls;

  void Awake() {
    Controls = GetComponentsInChildren&lt;SettingsControl&gt;();
  }

  /// &lt;summary&gt;
  /// Loads the data
  /// &lt;/summary&gt;
  /// &lt;param name="data"&gt;&lt;/param&gt;
  public void Load(Dictionary&lt;string, string&gt; data) {
    if (Controls != null)
      foreach (var control in Controls)
        control.Load(data);
  }

  /// &lt;summary&gt;
  /// Saves the data and returns a dictionary of keyvalues
  /// &lt;/summary&gt;
  /// &lt;returns&gt;&lt;/returns&gt;
  public Dictionary&lt;string, string&gt; Save() {
    Dictionary&lt;string, string&gt; data = new Dictionary&lt;string, string&gt;();
    if (Controls != null)
      foreach (var control in Controls) {
        control.Save(data);
      }
    return data;
  }
}
</code></pre>
    </CodeBlock>
    <h4 id="gamesettingsrawcs">GameSettingsRaw.cs</h4>
    <CodeBlock>
      <pre><code class="csharp language-csharp">[Serializable]
public class GameSettingsRaw {
  public List&lt;GameSettingsKVP&gt; settings = new List&lt;GameSettingsKVP&gt;();

  public GameSettingsRaw(Dictionary&lt;string, string&gt; settings) {
    foreach (KeyValuePair&lt;string, string&gt; kvp in settings) {
      this.settings.Add(new GameSettingsKVP { Key = kvp.Key, Value = kvp.Value });
    }
  }

  // converts this to settings
  public Dictionary&lt;string, string&gt; GetSettings() {
    Dictionary&lt;string, string&gt; data = new Dictionary&lt;string, string&gt;();
    foreach (GameSettingsKVP kvp in settings) {
      data.Add(kvp.Key, kvp.Value);
    }
    return data;
  }
}

[Serializable]
public class GameSettingsKVP {
  public string Key;
  public string Value;
}
</code></pre>
    </CodeBlock>
    <p>
      With these, all the necessary implementation for our setting's lightweight
      persistence was complete.
    </p>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/debug-settings-menu/code-architecture-diagram.png',
          subtitle: 'Basic module interaction diagram for the debug menu.'
        }"
      />
    </p>
    <h3 id="application">Application</h3>
    <p>
      The simplicity of this menu allows you as the programmer to decide what
      should be modifiable, as well as what exactly a setting is defined as.
    </p>
    <p>
      In the simple case, think of the max HP of your player. We would simply
      have a number input field that updates your <code>MaxHP</code> variable.
      This idea though could be extended to more complicated concepts such as
      having a setting that modifies the entire behaviour of a mechanic in your
      game. Say you were building a fighting game with an ultimate meter
      mechanic and wanted to decide which of the following was more fun:
    </p>
    <ol>
      <li>Upon a successful combo, the ultimate meter would increase.</li>
      <li>Or upon taking damage, your ultimate meter would slowly increase.</li>
    </ol>
    <p>
      The way this could be accomplished in the context of our settings menu, is
      to simply have an <code>Enum</code> property that could decide between
      option 1 or 2.
    </p>
    <CodeBlock>
      <pre><code class="csharp language-csharp">public enum UltimateMeterType {
  SuccessCombo,
  DamageTaken
}
public UltimateMeterType ultimateMeterType;

public TakeDamage(int damage) {
  if (ultimateMeterType == UltimateMeterType.DamageTaken) {
    // update meter
  }
}

public Attack() {
  if (comboCompleted &amp;&amp; ultimateMeterType == UltimateMeterType.SuccessCombo) {
    // update meter
  }
}
</code></pre>
    </CodeBlock>
    <p>
      <PostImageComponent
        class="post-image"
        :image="{
          uri: 'posts/debug-settings-menu/settings-example.gif',
          subtitle:
            'A simple example of how we can expose the dash length of our player to the debug menu. As seen by the other settings there are plenty of configurations playtesters can tweak.'
        }"
      />
    </p>
    <h2 id="conclusion">Conclusion</h2>
    <p>
      Spending the efforts to streamline this process proved to our team how
      fast development can be while still allowing everyone to provide their own
      meaningful individual feedback. Building a persistent debug menu helped my
      team and I quickly bring a feature from concept to polish. It also
      provided us quicker feedback for scraping a feature so that we could move
      on to newer and better ideas.
    </p>
    <p>
      All of the code in this article can be found
      <a
        href="https://github.com/mbitzos/devblog-code-examples/tree/main/debug-settings-menu"
        >here on my GitHub.</a
      >
    </p>
    <h2 id="afterword">Afterword</h2>
    <p>
      I first created the debug settings framework for my team about 2 years ago
      and reflecting back I think if I were to have another crack at it, I would
      attempt to make a solution entirely driven with code. Not only do I hate
      every second working with Unity's UI framework, but if you've ever read my
      previous articles you'll know how much I enjoy solving problems
      programmatically.
    </p>
    <p>
      Using
      <a
        href="https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/"
        target="_blank"
        >C# attributes</a
      >
      I think it would be entirely possible to create a solution that would be
      able to dynamically fetch settings from any scripts and generate the UI at
      run-time. Of course this loses some granularity of control over the UI,
      but the developer experience would probably make this worth it. Maybe one
      of these days I'll do a v2 of this idea.
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

<template>
  <div>
    <p>
      Hey everyone. My name is Michael, welcome to my devblog where I will be
      writing about my game development experience over the past 5 years. At the
      time of writing this I am taking a break from gamedev to focus on other
      things, one of which is this blog.
    </p>
    <h2 id="background">Background</h2>
    <p>
      My friends and I formed an indie game studio called Overlook Studios
      during our third year of university and began working on 2D games in
      Unity. With a seemingly endless supply of motivation and creativity, we
      were driven by passion and the desire to learn how to make games.
    </p>
    <p>
      Over the years, we worked on various projects ranging from an atmospheric
      survival horror game to a rhythm-based beat-em-up roguelike.
    </p>
    <p>The team:</p>
    <ul>
      <li>Michael Bitzos - Lead programmer</li>
      <li>
        <a href="https://www.artstation.com/pixelgrim" target="_blank"
          >Adam Mawby</a
        >
        - Artist
      </li>
      <li>Ben Petkovsek - Designer/Programmer</li>
      <li>Cole Bondarewski - Music/SFX</li>
    </ul>
    <p>Now you might be asking:</p>
    <p><em>"What games did you release?"</em></p>
    <p>And the answer is:</p>
    <p><strong>None.</strong></p>
    <p>
      Even though our projects weren't finished, there is still a thousand hours
      of hard work, a hundred thousand lines of code, and a large repository of
      knowledge that can be learned from.
    </p>
    <h2 id="purpose">Purpose</h2>
    <p>
      My goal is to share my experiences as the lead programmer for my team as
      well as how I incorporated my education and professional experience as a
      software engineer into designing the systems for the various core gameplay
      frameworks, features, and mechanics needed for our projects.
    </p>
    <p>
      This blog is for anyone with a decent understanding of programming who is
      struggling to make games because of the challenges they face writing
      clean, maintainable, and scalable code. There will be an overarching focus
      on the technical skills of making 2D games in the Unity engine.
    </p>
    <p>
      With any luck, you can learn from some of the lessons I've learned so that
      your technical abilities are not the reason you can't complete your dream
      game.
    </p>
    <h2 id="conclusion">Conclusion</h2>
    <p>
      If you continue to read this blog, thank you for following me, hopefully
      reading about my challenges will help you overcome yours.
    </p>
    <p>
      If you have any questions feel free to contact me:
      <a href="mailto:m.bitzos@gmail.com">m.bitzos@gmail.com</a>
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

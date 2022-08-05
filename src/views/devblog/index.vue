<template>
  <div id="devblog">
    <div id="navbar">
      <router-link to="/" custom v-slot="{ navigate }">
        <img
          @click="navigate"
          title="Art by Adam Mawby!"
          class="face"
          src="@/assets/about/digital_face.png"
          role="link"
        />
      </router-link>
      <div class="title-container">
        <div class="title">michael bitzos <span>[devblog]</span></div>
        <div class="subtitle is-5">
          reflectin' on gamedev.
        </div>
      </div>
    </div>
    <div id="navbar-border" />
    <div id="navbar-border" class="second" />
    <div id="main-content">
      <div id="sidebar-expander" :class="{ open: open }">
        {{ !open ? "&#8250;" : "&#8249;" }}
        <div @click="toggleOpen" />
      </div>
      <div id="sidebar-container" :class="{ open: open }">
        <sidebar />
      </div>
      <div id="blackout" @click="open = false" :class="{ show: open }"></div>
      <div id="sidebar-border" />
      <div id="sidebar-dot"></div>
      <div id="post-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import sidebar from "./components/sidebar.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { sidebar },
  data() {
    return {
      open: false
    };
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    }
  }
});
</script>

<style lang="scss">
#devblog {
  width: 65%;
  padding-top: 2em;
  padding-bottom: 2em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
#navbar {
  justify-content: flex-start;
  flex-direction: row;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-left: 15px;

  .face {
    margin: 10px;
    margin-right: 30px;
    image-rendering: pixelated;
    width: 100px;

    &:hover {
      cursor: pointer;
    }
  }
  .title-container {
    margin-top: 20px;
    .title,
    .subtitle {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .title {
      margin-right: 0.5em;
      font-family: Akagi-Black;
      font-size: 40px;

      span {
        font-size: smaller;
        color: gray;
        font-size: 20px;
      }
    }
    .subtitle {
      font-size: 20px;

      span {
        display: none;
      }
    }
  }
}

$grad: 0%;
$sidebar-width-small: 200px;
$sidebar-width: 250px;
$sidebar-transition: 0.2s;

#navbar-border {
  height: 1px;
  width: 100%;
  $end-grad: rgba($pink, $border-opacity) $grad;
  $start-grad: transparent 0%;
  background: linear-gradient(-90deg, $start-grad, $end-grad);
  flex-shrink: 0;

  &.second {
    margin-top: 5px;
  }
}
#sidebar-border {
  width: 1px;
  $end-grad: rgba($pink, $border-opacity) $grad;
  $start-grad: transparent 0%;
  background: linear-gradient(0deg, $start-grad, $end-grad);
  flex-shrink: 0;
}

#sidebar-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  background-image: linear-gradient(
    to top left,
    transparent 50%,
    rgba($pink, 0.5) 0
  );
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: left, right;
}

#main-content {
  justify-content: flex-start;
  flex-direction: row;
  display: flex;
  align-items: stretch;

  #blackout {
    position: fixed;
    z-index: 100;
    background-color: transparent;
    pointer-events: none;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    transition: background-color $sidebar-transition;

    &.show {
      background-color: rgba(black, 0.5);
      pointer-events: unset;
    }
  }
  #sidebar-expander {
    position: fixed;
    top: 40%;
    left: 0;
    width: 2.5%;
    height: 100px;
    background-color: #fcd8f4;
    border-color: $pink;
    border: 1px solid rgba($pink, 0.5);
    border-left: 0;
    border-right: 0;
    z-index: 102;

    display: flex;
    justify-content: center;
    align-items: center;
    color: $pink;
    font-size: 30px;

    visibility: hidden;
    transition: left $sidebar-transition;

    &.open {
      left: $sidebar-width;
      border-right: 1px;
    }
    div {
      position: absolute;
      background-color: transparent;
      width: 50px;
      height: 100px;
    }
  }
  #sidebar-container {
    width: 250px;
    flex-shrink: 0;
  }
  #post-container {
    flex-grow: 1;
  }

  #sidebar-container,
  #post-container {
    padding: 30px;
    padding-top: 30px;
  }
}

/** RESPONSIVE **/
@media screen and (max-width: 1600px) {
  #devblog {
    width: 75%;

    #sidebar-container {
      width: $sidebar-width-small;
    }
  }
}

@media screen and (max-width: 1200px) {
  #devblog {
    width: 95%;

    #main-content {
      #post-container {
        padding: 15px;
        padding-top: 30px;
      }
    }
  }
}

@media screen and (max-width: 850px) {
  #devblog {
    #sidebar-container {
      position: fixed;
      background: white;
      height: 100%;
      width: $sidebar-width;
      z-index: 101;
      top: 0;
      left: -$sidebar-width;
      border-right: 1px solid $pink;
      &.open {
        left: 0px;
      }
      transition: left $sidebar-transition;
    }
    #navbar-border.second {
      // display: none;
    }
    #main-content {
      #sidebar-expander {
        visibility: visible;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  #navbar {
    .face {
      width: 70px;
    }
    .title-container {
      .title {
        font-size: 30px;
        span {
          font-size: 20px;
        }
      }
      .subtitle {
        font-size: 18px;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  #navbar {
    padding-bottom: 0;
    .title-container {
      padding-bottom: 20px;
    }
    .face {
      width: 50px;
      margin-right: 20px;
    }
  }
}

@media screen and (max-width: 450px) {
  #navbar {
    // .face {
    //   width: 50px;
    //   margin-right: 15px;
    // }
    .title-container {
      .title {
        font-size: 25px;
        span {
          font-size: 15px;
        }
      }
      .subtitle {
        font-size: 15px;
      }
    }
  }
}
</style>

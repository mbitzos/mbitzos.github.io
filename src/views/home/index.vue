<template>
  <div class="content col">
    <div id="header" class="row">
      <div id="header-text" class="col">
        <div class="hey">hey</div>
        <div class="name">i'm michael bitzos.</div>
      </div>
      <div class="headshot-container">
        <img src="@/assets/face1.jpg" />
        <img src="@/assets/face2.jpg" />
      </div>
    </div>
    <hr id="hr-1" />
    <div id="software-developer" class="row">
      <div class="icon-container row">
        <div id="vue">
          <img src="@/assets/vue-logo.png" />
        </div>
        <div id="java">
          <img src="@/assets/java-logo.svg" />
        </div>
      </div>
      <div>
        <div class="text-block-header header">
          i'm a software developer professionally.
        </div>
        <div class="text-block" style="text-align: right">
          <div>i work full-stack with vue.js & java</div>
          <div>
            here's my
            <a href="./resume.pdf" target="_blank">resume</a>
          </div>
          <div>
            here's my
            <a href="https://github.com/mbitzos" target="_black">github</a>
          </div>
        </div>
      </div>
    </div>
    <hr id="hr-2" />
    <div id="game-developer" class="row">
      <div>
        <div class="text-block-header header">
          i'm a game developer on the side.
        </div>
        <div class="text-block">
          <div>I make games with my friends</div>
          <div>we're called overlook studios</div>
          <div>We use using unity 2019</div>
          <div>
            <a href="https://overlook-studios.com" target="_blank"
              >check us out</a
            >
          </div>
        </div>
      </div>
      <div class="icon-container row">
        <div id="unity">
          <img src="@/assets/unity-logo.png" />
        </div>
        <div id="overlook">
          <img src="@/assets/os-logo.png" />
        </div>
      </div>
    </div>
    <div id="contact">
      <div class="header">contact me</div>
      <div class="row">
        <div class="contacts">
          <a href="mailto:mbitzos@gmail.com">email</a>
          <a href="https://www.linkedin.com/in/michaelbitzos/" target="_blank"
            >linkedin</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Home",
  data: () => {
    return {};
  }
});
</script>

<style lang="scss" scoped>
$pink: #f464d5;

img {
  user-select: none;
}

$start-grad: white 40%;
$end-grad: rgba($pink, 0.5) 100%;
hr {
  width: 100%;
  height: 1px;
  border: none;
  margin-top: 25px;
  margin-bottom: 25px;

  &#hr-1 {
    background: linear-gradient(90deg, $start-grad, $end-grad);
    margin-top: 35px;
  }
  &#hr-2 {
    background: linear-gradient(-90deg, $start-grad, $end-grad);
  }
}
.content {
  justify-content: space-between;

  > .row {
    justify-content: space-between;
    align-items: center;
  }
}

.text-block-header {
  font-size: 24px;
}
.text-block {
  font-size: 18px;
}

a {
  color: $pink;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s all;

  &:hover {
    text-decoration: underline;
  }
}

#header {
  .hey {
    font-size: 48px;
    font-family: Akagi-Black;
  }
  .name {
    font-size: 48px;
  }
}

.header {
  margin-bottom: 10px;
  font-weight: bold;
}

.headshot-container {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.5s opacity;
  }
  img {
    &:first-child {
      opacity: 1;
    }

    &:nth-child(2) {
      opacity: 0;
    }
  }

  &:hover {
    img {
      &:first-child {
        opacity: 0;
      }

      &:nth-child(2) {
        opacity: 1;
      }
    }
  }
}

.icon-container {
  div {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid rgba(black, 0.1);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div:not(:last-child) {
    margin-right: 20px;
  }

  #overlook {
    img {
      height: 100%;
      width: 100%;
    }
  }

  #unity {
    img {
      margin-right: 10px;
      width: 65%;
    }
  }

  #java {
    img {
      width: 50%;
    }
  }

  #vue {
    img {
      width: 65%;
      margin-top: 10px;
    }
  }
}
#contact {
  text-align: center;
  font-size: 24px;

  margin-top: 50px;
  .row {
    justify-content: center;
  }
  .contacts {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 120px;
    a {
      font-size: 18px;
    }
  }
}
</style>

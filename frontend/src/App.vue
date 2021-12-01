<template>
  <div class="list-client">
    <div class="row">
      <font-awesome-icon icon="user-secret" />
      <div
        class="cursor-pointer border col-lg-3 col-sm-12 remote-client-item"
        data-ipaddress=""
        data-id=""
        v-for="item in items"
        :key="item.id"
      >
        <div class="row">
          <div class="col-lg-6 col-sm-12 p-0">
            <img
              src="http://localhost:3000/screenshot/DC_A6_32_C9_5F_8B.png"
              class="img-fluid screen_image"
            />
          </div>
          <div class="col-lg-6 col-sm-12">
            <h3 class="mb-1 font-weight-bold hostname">{{ item.hostname }}</h3>
            <small class="text-mute">
              <span class="p-2 font-weight-bold ip_address">{{ item.ip }}</span>
              <span class="mac_address">{{ item.mac }}</span>
            </small>
            <div>
              <i
                class="fas fa-paper-plane cursor-pointer send-url"
                title="open page in remote browser"
              ></i>
              <i
                class="fas fa-camera cursor-pointer update-screenshot"
                title="take a screenshot"
              ></i>
              <i
                class="
                  fas
                  fa-window-close
                  cursor-pointer
                  close-all-browser-page
                "
                title="close all remote browser page"
              ></i>
              <i
                class="fas fa-terminal cursor-pointer open-terminal"
                title="open ssh connection"
              ></i>
              <i
                class="fas fa-power-off cursor-pointer reboot-remote-device"
                title="reboot remote device"
              ></i>
              <i
                class="fas fa-fingerprint cursor-pointer show-osd-number"
                title="show display number"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      items: [],
    };
  },

  created() {
    this.getClient();
  },

  methods: {
    // Get All Products
    async getClient() {
      try {
        // alert("ok");
        const response = await axios.get("http://localhost:3000/index");
        this.items = response.data;
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
.screen_image {
  min-width: 200px;
}
</style>
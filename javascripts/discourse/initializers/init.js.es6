import { withPluginApi } from "discourse/lib/plugin-api"

export default {
  name: "custom-homepage",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      fetch("/latest.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          updateLatest(data)
        })
        .catch((error) => console.log(error))

      function updateLatest(data) {
        const list = document.getElementById("latest-topics-bar")
        const topics = data.topic_list.topics
        const div = document.createElement("div")
        const ul = document.createElement("ul")
        const ul2 = document.createElement("ul")
        list.innerHTML = ""

        for (let i = 0; i < topics.slice(0, 5).length; i++) {
          let topic = document.createElement("li")
          let a = document.createElement("a")
          a.href =
            "/t/" +
            topics[i].slug +
            "/" +
            topics[i].id +
            "/" +
            topics[i].last_read_post_number
          a.innerHTML = topics[i].title
          topic.appendChild(a)
          ul.appendChild(topic)
        }

        ul2.innerHTML = ul.innerHTML

        div.appendChild(ul)
        div.appendChild(ul2)
        list.appendChild(div)
      }
      api.registerConnectorClass("below-site-header", "custom-homepage", {
        setupComponent(args, component) {
          var topMenuRoutes = component.siteSettings.top_menu
            .split("|")
            .map(function (route) {
              return "/" + route
            })
          var homeRoute = topMenuRoutes[0]

          api.onPageChange((url) => {
            if (url === "/" || url === homeRoute) {
              document.querySelector("html").classList.add("custom-homepage")
              component.set("displayCustomHomepage", true)
            } else {
              document.querySelector("html").classList.remove("custom-homepage")
              component.set("displayCustomHomepage", false)
            }
          })
        },
      })
    })
  },
}

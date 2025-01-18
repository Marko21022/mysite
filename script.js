document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const input = document.querySelector("input");
  const button = document.querySelector("button");
  const resultContainer = document.getElementById("result");
  const heading = document.querySelector("h1");

  // Function to trigger the search when the button is clicked
  window.searchRobloxUser = async function () {
    const username = document.getElementById("username").value;

    // Show or hide the search bar's position smoothly based on the input
    if (username) {
      // If username is entered, move the search bar up
      input.style.marginTop = "0.5rem"; // Move up
    } else {
      // If username is empty, smoothly bring the search bar down to the center
      input.style.marginTop = "3rem"; // Keep it centered
    }

    // Show or hide the result container based on input value
    if (!username) {
      // If no username is entered, hide the result container
      resultContainer.classList.remove("show");
    } else {
      try {
        // Step 1: Fetch user data from Roblox API (via proxy)
        const response = await fetch(
          `https://roblox-api.tobygoodman2012.workers.dev?username=${encodeURIComponent(
            username
          )}`
        );
        const data = await response.json();

        console.log("API Response:", data);

        // Step 2: Check if user exists in the response
        if (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          const user = data.data[0];

          // Only proceed if the username matches exactly
          if (user.name.toLowerCase() === username.toLowerCase()) {
            // Step 3: Fetch the avatar image using the user's ID
            const avatarResponse = await fetch(
              `https://corsproxy.io/?https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=352x352&format=Png`
            );
            const avatarData = await avatarResponse.json();

            console.log("Avatar Response:", avatarData);

            // Step 4: Check if avatar data exists
            if (
              avatarData &&
              avatarData.data &&
              Array.isArray(avatarData.data) &&
              avatarData.data.length > 0
            ) {
              const avatarUrl = avatarData.data[0].imageUrl;

              // Step 5: Update the result container with username, display name, and avatar
              resultContainer.innerHTML = 
                `<h2>Username: ${user.name}</h2>
                 <p>Display Name: ${user.displayName}</p>
                 <img src="${avatarUrl}" alt="${user.name}'s avatar" style="width: 300px; height: 300px; border-radius: 8px; margin-top: 10px;">`;
              resultContainer.classList.add("show");
            } else {
              // Handle case where avatar is not found
              resultContainer.innerHTML = `<p>Avatar not found for user "${username}".</p>`;
              resultContainer.classList.add("show");
            }
          } else {
            alert(`No exact match found for the username "${username}".`);
          }
        } else {
          alert(`No user found with the username "${username}".`);
        }
      } catch (error) {
        console.error("Error fetching Roblox user data:", error);
        alert("Error fetching user data. Please try again later.");
      }
    }
  };
});

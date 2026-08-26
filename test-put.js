const URL = "https://www.dengarkan.id/api/global-setting";

async function run() {
    console.log("Fetching current setting...");
    let res = await fetch(URL);
    let json = await res.json();
    console.log(JSON.stringify(json, null, 2));
}

run();

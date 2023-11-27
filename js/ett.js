/* --------------- World size --------------- */
const formatterRes = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
});

const formatterProd = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
});

/* --------------- World size --------------- */
const worldSize = 200;
let buildingsSize = 12; // Initial for a single house
let wastelandSize = 20;

/**
 * Get the available forest
 * @returns {number} forest size
 */
function getForestSize() {
    return worldSize - wastelandSize - buildingsSize;
}

/**
 * Cuts down a tree from the forest
 */
function cutDownTree() {
    if ((buildingsSize + wastelandSize) < worldSize) {
        wastelandSize++;
        updateWorldProgressBar();
    }
}

/**
 * Checks if there is enough room to build a building
 * @returns {boolean}
 */
function isRoomToBuild() {
    return wastelandSize > 0;
}

/**
 * Transforms wasteland tile into a building tile
 */
function zoneBuilding() {
    wastelandSize--;
    buildingsSize++;
    updateWorldProgressBar();
}

/**
 * Plants a tree in wasteland, regenerating the forest
 */
function plantTree() {
    if (wastelandSize > 0) {
        wastelandSize--;
        updateWorldProgressBar();
    }
}

/* --------------- Forest capacity --------------- */
const forestMultipliers = {
    wood: 1,
    firewood: 0.5,
    meat: 0.01,
    veggies: 0.1,
    medicine: 0.02,
};

/**
 * Calculates the capacity of the forest for certain resource
 * @param {string} resource 
 * @returns {number} resource capacity
 */
function getCapacity(resource) {
    return getForestSize() * forestMultipliers[resource];
}

/* --------------- Manual actions --------------- */
let producing = false;
let producingButton = "";
let producingTarget = 0;
let producingCounter = 0;
let producingRequireUpdate = false;

const manualActionTimes = {
    wood: 10,
    firewood: 1,
    meat: 60,
    veggies: 10,
    medicine: 30,
};

/**
 * Calculates the required time to manually obtain a resource
 * @param {string} resource 
 * @returns {number} required time in seconds
 */
function getManualTime(resource) {
    return manualActionTimes[resource];
}

/**
 * Produces resource by clicking
 * @param {string} resource 
 */
function manualProduce(res) {
    if ("wood" == res) {
        cutDownTree();
    }
    producing = true;
    producingButton = res;
    producingTarget = manualActionTimes[res];
    document.getElementById('pageBody').innerHTML = getPageForest();
}

/* --------------- Poblation requirements --------------- */
const populationRequirements = {
    firewood: 0.1,
    meat: 0.01,
    veggies: 0.03,
    medicine: 0.01,
};

/**
 * Returns the required amount of resource per second for a certain population
 * @param {number} population 
 * @param {string} resource 
 * @returns {number} Required resource
 */
function getRequirement(population, resource) {
    if (resource == firewood) {
        return population * populationRequirements[resource] *
            getSeasonMultiplier() * getHousingTech();
    } else {
        return population * populationRequirements[resource];
    }
}

const seasonMultiplier = {
    spring: 0.3,
    summer: 0,
    fall: 0.5,
    winter: 1,
};

/**
 * Returns the firewood seasonal multiplier
 * @returns {number} season multiplier
 */
function getSeasonMultiplier() {
    return seasonMultiplier[getCurrentSeason()];
}

/**
 * Returns the current season
 * @returns {string} current season
 */
function getCurrentSeason() {
    return spring; // Fixed in the first version
}

/**
 * Gets the housing technology multiplier for firewood
 * @returns {number} housing multiplier
 */
function getHousingTech() {
    return 1; // Fixed in the first version
}

/* --------------- resources --------------- */
let resources = {
    wood: 30,
    firewood: 10,
    meat: 5,
    veggies: 10,
    medicine: 5,
    villagers: 6,
    unemployed: 0,
};

const resourceNames = {
    wood: "Wood",
    firewood: "Firewood",
    meat: "Meat",
    veggies: "Veggies",
    medicine: "Medicine",
    villagers: "Villager",
    unemployed: "Unemployed villager",
};

const resourceDescription = {
    wood: "Used to build",
    firewood: "Used to heat houses",
    meat: "Your villagers need to eat some meat",
    veggies: "Your villagers need to eat lots of veggies",
    medicine: "Used to maintain the villagers health",
    villagers: "Town inhabitant",
    unemployed: "Unemployed villagers",
};

let production = {
    wood: 0,
    firewood: 0,
    meat: 0,
    veggies: 0,
    medicine: 0,
};

/* --------------- buildings --------------- */
const buildingCosts = {
    houseI: {wood: 10},
    farm: {veggies: 10, unemployed: 2},
    lumberjack: {wood: 10, unemployed: 1},
    forester: {wood: 10, unemployed: 1},
    hunter: {wood: 10, unemployed: 1},
    collector: {wood: 10, unemployed: 1},
    druid: {wood:1, firewood: 5, meat: 1, veggies: 1, unemployed: 1},
};

const buildingNames = {
    houseI: "Basic House",
    farm: "Farm",
    lumberjack: "Lumberjack cabin",
    forester: "Forester cabin",
    hunter: "Hunter cabin",
    collector: "Collector cabin",
    druid: "Druids shelter",
};

const buildingInfo = {
    houseI: "A house made of logs. Provides shelter for a single townsman.",
    farm: "Produces veggies",
    lumberjack: "Cuts trees",
    forester: "Takes care of the forest",
    hunter: "Hunts forest animals",
    collector: "Collects resources from the forests (firewood and veggies)",
    druid: "Produce medicine using the magic of the forests",
};

const buildingProd = {
    houseI: {firewood: -0.05, meat: -0.001, veggies: -0.01, medicine: -0.001},
    farm: {veggies: 0.1},
    lumberjack: {wood: 0.1},
    forester: {},
    hunter: {meat: 0.1},
    collector: {firewood: 0.5},
    druid: {medicine: 0.1},
};

let buildings = {
    houseI: 7,
    farm: 1, // 2
    lumberjack: 1, // 1
    forester: 1, // 1
    hunter: 1, // 1
    collector: 1, // 1
    druid: 1, // 1
};

let forestEvolutionCounter = 0;

function forestEvolution() {
	forestEvolutionCounter -= buildings.lumberjack;
	if (!forestersPause) {
		forestEvolutionCounter += 3 * buildings.forester;
	}
	// TODO: add var to change the relationship between lumberjack and forester
	if (forestEvolutionCounter >= 10) {
		plantTree();
		forestEvolutionCounter = 0;
	} else if (forestEvolutionCounter <= -10) {
		cutDownTree();
		forestEvolutionCounter = 0;
	}
}

/**
 * Sets the production given the buildings
 */
function setProduction() {
    for (const res in production) {
        production[res] = 0;
    }
    for (const building in buildings) {
        q = buildings[building];
        if (q > 0) {
            for (const resource in buildingProd[building]) {
                multiplier = buildingProd[building][resource];
                production[resource] += q * multiplier;
            }
        }
    }
}

/**
 * Buildings production
 */
function produce() {
    for (const res in production) {
        resources[res] += production[res];
    }
	forestEvolution();
}

/**
 * Checks if a building can be built
 * @param {string} building 
 */
function canBeBuilt(building) {
    if (wastelandSize < 1) {
        return false;
    }
    for (const bc in buildingCosts[building]) {
        if (resources[bc] < buildingCosts[building][bc]) {
            return false;
        }
    }
    return true;
}

/**
 * Builds a building
 * @param {string} building 
 */
function build(building) {
    for (const bc in buildingCosts[building]) {
        resources[bc] -= buildingCosts[building][bc];
    }
    buildings[building]++;
    if (building == "houseI") {
        resources.unemployed++;
        resources.villagers++;
    }
    zoneBuilding();
    document.getElementById('pageBody').innerHTML = getPageBuildings();
}

/* --------------- Page --------------- */
let currentPage = "summary";

/**
 * Gets a dynamic page content
 * @param {Array} pageElements 
 * @returns string
 */
function getPage(pageElements) {
    pageBody = document.createElement("div");
    for (const elm of pageElements) {
        pageBody.appendChild(elm);
        separation = document.createElement("br");
        pageBody.appendChild(separation);
    }
    return pageBody.innerHTML;
}

/**
 * Generates the summary page html body
 * @returns {innerHTML}
 */
function getPageSummary() {
    currentPage = "summary";
    return getPage([
        getResourcesTable(),
        getForestCapacity(),
        getBuildingsTable()
    ]);
}

/**
 * Generates the manage page html body
 * @returns {innerHTML}
 */
function getPageForest() {
    currentPage = "forest";
    return getPage([
        getCard(
            [
                'manualProduce("wood")', 'manualProduce("firewood")',
                'manualProduce("meat")', 'manualProduce("veggies")',
                'manualProduce("medicine")'
            ],
            [
                emojis["lumberjack"], emojis["firewood"], emojis["hunter"],
                emojis["veggies"], emojis["medicine"]
            ],
            [
                "Cut a tree","Gather firewood","Go hunting","Gather veggies",
                "Gather medicines"
            ],
            [
                formatterRes.format(resources.wood) + " x " + emojis["wood"],
                formatterRes.format(resources.firewood) + " x " + emojis["firewood"],
                formatterRes.format(resources.meat) + " x " + emojis["meat"],
                formatterRes.format(resources.veggies) + " x " + emojis["veggies"],
                formatterRes.format(resources.medicine) + " x " + emojis["medicine"]
            ],
            [
                "Cut down a tree to get <strong>wood</strong>. " +
                "Clears a forest tile." + " Takes " + manualActionTimes.wood + 
                " seconds.",
                "Gather <strong>firewood</strong> from the forest." +
                " Takes " + manualActionTimes.firewood + " seconds.",
                "Hunt down an animal to get <strong>meat</strong>." +
                " Takes " + manualActionTimes.meat + " seconds.",
                "Gather <strong>veggies</strong> from the forest." +
                " Takes " + manualActionTimes.veggies + " seconds.",
                "Gather <strong>medicines</strong> from the forest." +
                " Takes " + manualActionTimes.medicine + " seconds."
            ],
            [producing, producing, producing, producing, producing],
            [
                "wood" == producingButton, "firewood" == producingButton,
                "meat" == producingButton, "veggies" == producingButton,
                "medicine" == producingButton
            ],
            ["Cut", "Gather", "Hunt", "Gather", "Gather"],
            ["Waiting","Waiting","Waiting","Waiting","Waiting"],
            ["Cutting", "Gathering", "Hunting", "Gathering", "Gathering"]
        )
    ]);
}

/**
 * Generates the buildings page html body
 * @returns {innerHTML}
 */
function getPageBuildings() {
    currentPage = "buildings";
    return getPage([
        getCard(
            [
                'build("houseI")',
                'build("farm")',
                'build("lumberjack")',
                'build("forester")',
                'build("hunter")',
                'build("collector")',
                'build("druid")',
            ],
            [
                emojis.houseI, emojis.farm, emojis.lumberjack, emojis.forester,
                emojis.hunter, emojis.collector, emojis.druid
            ],
            [
                buildingNames.houseI + "(" + buildings.houseI + ") ",
                buildingNames.farm + "(" + buildings.farm + ") ",
                buildingNames.lumberjack + "(" + buildings.lumberjack + ") ",
                buildingNames.forester + "(" + buildings.forester + ") ",
                buildingNames.hunter + "(" + buildings.hunter + ") ",
                buildingNames.collector + "(" + buildings.collector + ") ",
                buildingNames.druid + "(" + buildings.druid + ") ",
            ],
            [
                "Produces: " + getBuildingProdString("houseI"),
                "Produces: " + getBuildingProdString("farm"),
                "Produces: " + getBuildingProdString("lumberjack"),
                "Produces: " + getBuildingProdString("forester"),
                "Produces: " + getBuildingProdString("hunter"),
                "Produces: " + getBuildingProdString("collector"),
                "Produces: " + getBuildingProdString("druid"),
            ],
            [
                "Costs: " + getBuildingCostString("houseI"),
                "Costs: " + getBuildingCostString("farm"),
                "Costs: " + getBuildingCostString("lumberjack"),
                "Costs: " + getBuildingCostString("forester"),
                "Costs: " + getBuildingCostString("hunter"),
                "Costs: " + getBuildingCostString("collector"),
                "Costs: " + getBuildingCostString("druid"),
            ],
            [
                !canBeBuilt("houseI"),
                !canBeBuilt("farm"),
                !canBeBuilt("lumberjack"),
                !canBeBuilt("forester"),
                !canBeBuilt("hunter"),
                !canBeBuilt("collector"),
                !canBeBuilt("druid"),
            ],
            [false,false,false,false,false,false,false],
            ["Build","Build","Build","Build","Build","Build","Build"],
            [
                "No resources","No resources","No resources","No resources",
                "No resources","No resources","No resources"
            ],
            [
                "Building","Building","Building","Building","Building",
                "Building","Building"
            ]
        )
    ]);
}

/**
 * Generates the about page html body
 * @returns {innerHTML}
 */
function getPageAbout() {
    currentPage = "about";
    about = document.createElement("div");
    about.className = "container-fluid";
    about.innerHTML = "`README.md` was *not* found";
    about.innerHTML = "<md-block src='README.md'>";
    about.innerHTML += "`README.md` was *not* found";
    about.innerHTML += "</md-block>"
    return getPage([
        about
    ]);
}

/**
 * Generates the config page html body
 * @returns {innerHTML}
 */
function getPageConfig() {
    currentPage = "config";
    config = document.createElement("div");
    config.className = "container-fluid";
    config.appendChild(getBoolSwitch(
        "gamePause",
        "gamePauseSW",
        "Pause the game",
        gamePause,
        false));
    config.appendChild(getBoolSwitch(
        "forestersPause",
        "forestersPauseSW",
        "Pause the foresters",
        forestersPause,
        false));
    config.appendChild(getBoolSwitch(
        "sandboxMode",
        "sandboxModeSW",
        "Sandbox Mode",
        sandboxMode,
        sandboxMode));
    config.appendChild(darkModeSwitch());
    if (sandboxMode) {
        separation = document.createElement("hr");
        config.appendChild(separation);
        row = document.createElement("div");
        row.className = "row";
        config.appendChild(row);
        c1 = document.createElement("div");
        c1.className = "col";
        row.appendChild(c1);
        title = document.createElement("h2");
        title.innerHTML = "Town";
        c1.appendChild(title);
        for (const building in buildings) {
            c1.appendChild(getNumberInput(
                0,
                100,
                buildings[building],
                building,
                buildingNames[building],
                "60px"
            ));
        }
        c2 = document.createElement("div");
        c2.className = "col";
        row.appendChild(c2);
        title = document.createElement("h2");
        title.innerHTML = "Production settings";
        c2.appendChild(title);
        for (const bp in buildingProd) {
            prodBuilding = false;
            r1 = document.createElement("div");
            r1.className = "row";
            tit = document.createElement("h5");
            tit.innerHTML = buildingNames[bp];
            r1.appendChild(tit);
            r2 = document.createElement("ul");
            r2.className = "nav";
            const bbp = buildingProd[bp];
            for (const res in bbp) {
                prodBuilding = true;
                c = document.createElement("li");
                c.className = "nav-item";
                r2.appendChild(c);
                c.appendChild(
                    getNumberInput(
                        -10,
                        10,
                        bbp[res],
                        "buildingProd[" + bp + "]",
                        emojis[res],
                        "80px"
                        )
                        );
                    }
            if (prodBuilding) {
                c2.appendChild(r1);
                c2.appendChild(r2);
                sp = document.createElement("hr");
                c2.appendChild(sp);
            }
        }
    }
    return getPage([
        config
    ]);
}

/* --------------- Table --------------- */

/**
 * Generates a table given the contents
 * @param {Array} columnNames 
 * @param {Array} rows 
 * @param {string} title 
 * @returns {HTMLTableElement}
 */
function getTable(columnNames, rows, title) {
    cont = document.createElement("div");
    cont.className = "container-fluid";
    table = document.createElement("table");
    table.className = "table table-hover table-sm"
    table.style = "max-width = 400px";
    //table.style.width = "50%"; // TODO: delete
    
    if (title.length > 0) {
        cp = document.createElement("caption");
        cp.innerHTML = title;
        table.appendChild(cp);
    }
    
    trHeader = document.createElement("tr");
    trHeader.className = "table-primary"
    for (const col of columnNames) {
        th = document.createElement("th");
        th.innerHTML = col;
        trHeader.appendChild(th);
    }
    table.appendChild(trHeader);
    
    for (const row of rows) {
        tr = document.createElement("tr");
        tr.className = "table-info"
        for (const col of row) {
            td = document.createElement("td");
            td.innerHTML = col;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    cont.appendChild(table);
    return cont;
}

/**
 * Generates the resources table html object
 * @returns {HTMLElement}
 */
function getResourcesTable() {
    let content = [];
    let index = 0;
    for (const res in resources) {
        content[index] = [];
        content[index][0] = resourceNames[res] + " " + emojis[res];
        content[index][1] = formatterRes.format(resources[res]);
        if (production.hasOwnProperty(res)) {
            content[index][2] = formatterProd.format(production[res]);
        } else {
            content[index][2] = "-";
        }
        content[index][3] = resourceDescription[res];
        index++;
    }
    return getTable(
        ["Name", "Stored", "Production", "Description"],
        content,
        "Resources"
    );
}

/**
 * Generates the world table html object
 * @returns {HTMLElement}
 */
function getWorldTable() {
    ul = document.createElement("ul");
    ul.className = "list-group list-group-horizontal";
    names = ["World size", "Forest size", "Town size", "Wasteland size"];
    content = [worldSize, getForestSize(), buildingsSize, wastelandSize];
    for (let index = 0; index < names.length; index++) {
        li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.innerHTML = names[index] + ": " + content[index];
        ul.appendChild(li);
    }
    return ul;
}

/**
 * Generates the world progress bar
 * @returns {HTMLElement}
 */
function getWorldProgressBar() {
    master = document.createElement("div");
    r1 = document.createElement("div");
    r1.className = "container-fluid";
    master.appendChild(r1);
    r2 = document.createElement("div");
    r2.className = "container-fluid";
    master.appendChild(r2);

    span = document.createElement("span");
    span.className = "text-" + theme;
    if (gamePause) {
        span.innerHTML = "Game paused";
    } else if (forestersPause) {
        span.innerHTML = "Foresters paused";
    } else if (sandboxMode) {
        span.innerHTML = "Sandbox Mode!!!";
    } else {
        span.innerHTML = "Running";
    }
    r1.appendChild(span);

    div = document.createElement("div");
    div.className = "progress";
    div.style = "min-width: 200px"
    div.setAttribute("data-bs-toggle", "tooltip");

    wdWasteland = wastelandSize * 100 / worldSize;
    wdBuildings = buildingsSize * 100 / worldSize;
    wdForest = 100 - wdWasteland - wdBuildings;
    stWasteland = 'width:' + wdWasteland + '%'
    stBuildings = 'width:' + wdBuildings + '%'
    stForest = 'width:' + wdForest + '%'
    div.setAttribute("title", "Buildings: " + buildingsSize + "\nForest: " +
                     getForestSize() + "\nWasteland: " + wastelandSize);

    divBuilding = document.createElement("div");
    divBuilding.className = "progress-bar bg-warning";
    divBuilding.style = stBuildings;
    divBuilding.innerHTML = buildingsSize;
    div.appendChild(divBuilding);

    divForest = document.createElement("div");
    divForest.className = "progress-bar bg-success";
    divForest.style = stForest;
    divForest.innerHTML = getForestSize();
    div.appendChild(divForest);

    divWasteland = document.createElement("div");
    divWasteland.className = "progress-bar bg-danger";
    divWasteland.style = stWasteland;
    divWasteland.innerHTML = wastelandSize;
    div.appendChild(divWasteland);

    r2.appendChild(div);
    return master;
}

/**
 * Builds a table with the forest capacity
 * @returns {HTMLTableElement}
 */
function getForestCapacity() {
    let content = [];
    let index = 0;
    fs = getForestSize();
    for (const fm in forestMultipliers) {
        content[index] = [];
        content[index][0] = fm + " " + emojis[fm];;
        content[index][1] = "1 each " + 1/forestMultipliers[fm] + " titles";
        cap = forestMultipliers[fm] * fs;
        content[index][2] = Math.floor(cap);
        content[index][3] = cap;
        index++;
    }
    return getTable(
        ["Resource", "Generation", "Capacity", "Real capacity"],
        content,
        "Forest capacity"
    );
}

/**
 * Generates the buildings table html object
 * @returns {HTMLElement}
 */
function getBuildingsTable() {
    let content = [];
    let index = 0;
    for (const building in buildings) {
        //if (buildings[building] < 1) {
        //    continue;
        //}
        content[index] = [];
        content[index][0] = buildingNames[building] + " " + emojis[building];
        content[index][1] = buildings[building];
        content[index][2] = buildingInfo[building];
        index++;
    }
    return getTable(
        ["Name", "Quantity", "Description"],
        content,
        "Your town"
    );
}

/* --------------- Misc --------------- */

/**
 * Updates the upper right world progress bar
 */
function updateWorldProgressBar() {
    document.getElementById("WorldProgressBar").innerHTML = getPage([getWorldProgressBar()]);
}

/**
 * Gets a description of the production of a building with emojis
 * @param {string} building 
 * @returns {string}
 */
function getBuildingProdString(building) {
    const bp = buildingProd[building];
    var ret = "";
    var first = true;
    for (const res in bp) {
        if (!first) {
            ret += ", ";
        }
        ret += bp[res] + " " + emojis[res];
        first = false;
    }
    if (ret.length == 0) {
        ret = "-";
    }
    return ret;
}

/**
 * Gets a description of the costs of a building with emojis
 * @param {string} building 
 * @returns {string}
 */
function getBuildingCostString(building) {
    const bp = buildingCosts[building];
    var ret = "";
    var first = true;
    for (const res in bp) {
        if (!first) {
            ret += ", ";
        }
        ret += Math.floor(resources[res]) + "/" + bp[res] + " " + emojis[res];
        first = false;
    }
    if (ret.length == 0) {
        ret = "-";
    }
    return ret;
}

/* --------------- Cards --------------- */
const emojis = {
    wood: "&#129717",
    firewood: "&#128293",
    meat: "&#129385",
    veggies: "&#129382",
    medicine: "&#128138",
    houseI: "&#129489",
    farm: "&#127806",
    lumberjack: "&#129683",
    forester: "&#127794",
    hunter: "&#127993",
    collector: "&#127807",
    druid: "&#129497",
    villagers: "&#128100",
    unemployed: "&#9203",
};

/**
 * Helper function to build a BS5 card
 * @param {string} cardsFunction Function the button will invoke
 * @param {string} cardsEmoji emoji to show in the title
 * @param {string} cardsTitle the title of the card
 * @param {string} quantityDesc First paragraph
 * @param {string} cardsDesc Second paragraph
 * @param {boolean} cardsDisabled Indicates the button is disabled
 * @param {boolean} cardsProducing Indicates the button has loading spinner
 * @param {string} cardsOkMsg Button message if everything ok
 * @param {string} cardsWaitMsg Button message if waiting
 * @param {string} cardsProdMsg Button message if button disabled
 * @returns 
 */
function getCard(cardsFunction, cardsEmoji, cardsTitle, quantityDesc, cardsDesc, 
                 cardsDisabled, cardsProducing, cardsOkMsg, cardsWaitMsg, 
                 cardsProdMsg) {
    div = document.createElement("div");
    div.className = "row";

    for (let index = 0; index < cardsFunction.length; index++) {
        var card = '<div class="col-md-3">';
        card += '<div class="card">';
        card += '<div class="card-body">';
        card += '<h4 class="card-title">' + cardsTitle[index];
        card += cardsEmoji[index] + '</h4>';
        card += '<p class="card-text">' + quantityDesc[index] + '</p>';
        card += '<p class="card-text">' + cardsDesc[index] + '</p>';
        card += '<button type="button" onclick=' + cardsFunction[index];
        card += ' class="btn btn-success"';
        if (cardsDisabled[index]) {
            card += ' disabled';
        }
        card += '>';
        if (cardsProducing[index]) {
            card += '<span class="spinner-border spinner-border-sm"></span>';
            card += " " + cardsProdMsg[index];
        } else if (cardsDisabled[index]) {
            card += cardsWaitMsg[index];
        } else {
            card += cardsOkMsg[index];
        }
        card += '</button></div></div>';
        div.innerHTML += card.trim();
    }
    return div;
}

/* --------------- Switches --------------- */

/**
 * Callback for a switch
 * @param {string} varName 
 * @param {string} switchID 
 */
function switchAction(varName, switchID) {
    var switchState = document.getElementById(switchID).checked;
    window[varName] = switchState;
    updateWorldProgressBar();
    update();
}

/**
 * Creates a switch button with a toggle action
 * @param {string} varName 
 * @param {string} switchID 
 * @param {string} switchMsg 
 * @returns {HTMLElement}
 */
function getBoolSwitch(varName, switchID, switchMsg, initial, disabled) {
    fun = 'switchAction(\'' + varName + '\',\'' + switchID + '\')';
    return getSwitch(fun, switchID, switchMsg, initial, disabled);
}

/**
 * Creates a switch button with toggle action for dark mode
 * @returns {htmlElement}
 */
function darkModeSwitch() {
    return getSwitch("darkModeCallback()", "DarkModeSW", "Dark Mode", theme == "dark", false);
}

/**
 * Creates a switch button that calls a function when toggle
 * @param {string} fun 
 * @param {string} switchID 
 * @param {string} switchMsg 
 * @param {boolean} initial 
 * @returns {htmlElement}
 */
function getSwitch(fun, switchID, switchMsg, initial, disabled) {
    div = document.createElement("div");
    switchButton = '<div class="form-check form-switch">'
    switchButton += '<input class="form-check-input" type="checkbox" id="' + switchID + '"';
    if (initial) {
        switchButton += ' checked';
    }
    switchButton += ' onchange="' + fun + '"';
    if (disabled) {
        switchButton += ' disabled'
    }
    switchButton += '>'
    switchButton += '<label class="form-check-label" for="' + switchID + '">'
    switchButton += switchMsg + '</label>';
    switchButton += '</div>'
    div.innerHTML = switchButton.trim();
    return div;
}

/* --------------- Inputs --------------- */

/**
 * Callback for an input
 * @param {number} val 
 * @param {string} building
 */
function inputBuildingsCallback(val, building) {
    buildings[building] = val;
}

/**
 * Creates an input that sets a variable when changed
 * @param {number} min 
 * @param {number} max 
 * @param {number} def 
 * @param {string} varName 
 * @param {string} text 
 * @param {string} mw 
 * @returns {htmlElement}
 */
function getNumberInput(min, max, def, varName, text, mw) {
    div = document.createElement("div");
    div.className = "input-group input-group-sm mb-3";
    group = document.createElement("div");
    group.className = "input-group-prepend";
    msg = document.createElement("span");
    msg.className = "input-group-text";
    msg.id = "inputGroup-sizing-sm";
    msg.innerHTML = text;
    group.appendChild(msg);
    div.appendChild(group);
    myInput = document.createElement("input");
    myInput.setAttribute("type", "number");
    myInput.setAttribute("class", "form-control");
    myInput.style = "max-width:" + mw;
    myInput.setAttribute("aria-describedby", "inputGroup-sizing-sm");
    myInput.setAttribute("min", min);
    myInput.setAttribute("max", max);
    myInput.setAttribute("value", def);
    myInput.setAttribute(
        "oninput",
        "inputBuildingsCallback(this.value,'" + varName + "')"
    );
    div.appendChild(myInput);
    return div;
}

/* --------------- Engine --------------- */

gamePause = false;
forestersPause = false;
sandboxMode = false;
lastSandboxMode = false;

/**
 * Function called after the body loads
 */
function init() {
    // Load saved data
    load();
    // Calculate offline time and resources
    // TODO
    // Run the main loop
    run();
}

/**
 * Main loop
 */
function run() {
    setProduction();
    if (!gamePause) {
        produce();
        updateButton();
        update();
    }
    setTimeout("run()", 1000);
}

/**
 * Function to update the manual buttons
 */
function updateButton() {
    if (producingTarget > 0) {
        producingCounter++;
        if (producingCounter > producingTarget) {
            resources[producingButton]++;
            producingCounter = 0;
            producingTarget = 0;
            producing = false;
            producingButton = "";
            producingRequireUpdate = true;
        }
    }
}

/**
 * Function to update the pages
 */
function update() {
    if (sandboxMode) {
        document.getElementById('saveButton').disabled = true;
        document.getElementById('resetButton').disabled = true;
    } else {
        document.getElementById('saveButton').disabled = false;
        document.getElementById('resetButton').disabled = false;
    }
    switch (currentPage) {
        case "summary":
            document.getElementById('pageBody').innerHTML = getPageSummary();
            break;
        case "forest":
            document.getElementById('pageBody').innerHTML = getPageForest();
            break;
        case "buildings":
            document.getElementById('pageBody').innerHTML = getPageBuildings();
            break;
        case "about":
            break;
        case "config":
            if (lastSandboxMode != sandboxMode) {
                lastSandboxMode = sandboxMode;
                document.getElementById('pageBody').innerHTML = getPageConfig();
            }
            break;
    }
}

/**
 * Gets the storage full key for a certain parameter
 * @param {string} param 
 * @returns {string}
 */
function getStorageKey(paramName) {
    return "eco_town_tycoon_" + paramName;
}

/**
 * Save data into browser storage
 */
function save() {
    localStorage.setItem(
        getStorageKey("buildingsSize"),
        buildingsSize
    );
    localStorage.setItem(
        getStorageKey("wastelandSize"),
        wastelandSize
    );
    localStorage.setItem(
        getStorageKey("producing"),
        producing
    );
    localStorage.setItem(
        getStorageKey("producingButton"),
        producingButton
    );
    localStorage.setItem(
        getStorageKey("producingTarget"),
        producingTarget
    );
    localStorage.setItem(
        getStorageKey("producingCounter"),
        producingCounter
    );
    localStorage.setItem(
        getStorageKey("producingRequireUpdate"),
        producingRequireUpdate
    );
    for (const res in resources) {
        localStorage.setItem(
            getStorageKey("resources_" + res),
            resources[res]
        );
    }
    for (const prod in production) {
        localStorage.setItem(
            getStorageKey("production_" + prod),
            production[prod]
        );
    }
    for (const b in buildings) {
        localStorage.setItem(
            getStorageKey("buildings_" + b),
            buildings[b]
        );
    }
    localStorage.setItem(
        getStorageKey("lumberjackCounter"),
        lumberjackCounter
    );
    localStorage.setItem(
        getStorageKey("foresterCounter"),
        foresterCounter
    );
    localStorage.setItem(
        getStorageKey("theme"),
        theme
    );
}

/**
 * Delete data from browser storage
 */
function clearKeys() {
    localStorage.clear();
}

/**
 * Helper to load key-values from database
 * @param {string} key Key for the database
 * @param {string} defVal Default value in case key is not stored
 * @returns 
 */
function loadKeyDefault(key, defVal) {
    var savedVal = localStorage.getItem(getStorageKey(key));
    if (null == savedVal) {
        return defVal;
    }
    return savedVal;
}

/**
 * Loads data from browser storage
 */
function load() {
    buildingsSize = loadKeyDefault("buildingsSize", buildingsSize);
    wastelandSize = loadKeyDefault("wastelandSize", wastelandSize);
    producing = loadKeyDefault("producing", producing);
    producingButton = loadKeyDefault("producingButton", producingButton);
    producingTarget = loadKeyDefault("producingTarget", producingTarget);
    producingCounter = loadKeyDefault("producingCounter", producingCounter);
    producingRequireUpdate = loadKeyDefault("producingRequireUpdate", producingRequireUpdate);
    for (const res in resources) {
        resources[res] = parseFloat(loadKeyDefault("resources_" + res, resources[res]));
    }
    for (const prod in production) {
        production[prod] = parseFloat(loadKeyDefault("production_" + prod, production[prod]));
    }
    for (const b in buildings) {
        buildings[b] = parseFloat(loadKeyDefault("buildings_" + b, buildings[b]));
    }
    lumberjackCounter = loadKeyDefault("lumberjackCounter", lumberjackCounter);
    foresterCounter = loadKeyDefault("foresterCounter", foresterCounter);
    theme = loadKeyDefault("theme", theme);
    setTheme();
}

/* --------------- Dark mode --------------- */
theme = "light";
navBar = "navbar-dark bg-dark";

/**
 * Function that switches between dark and light modes
 */
function darkModeCallback() {
    if ("light" == theme) {
        theme = "dark";
    } else {
        theme = "light";
    }
    setTheme();
}

/**
 * Function to set the light or dark theme
 */
function setTheme() {
    var htmlElement = document.getElementsByTagName("html")[0];
    htmlElement.setAttribute("data-bs-theme", theme);
    if ("light" == theme) {
        document.getElementById("MenuNavBar").className = "navbar navbar-expand-lg navbar-dark bg-dark";
    } else {
        document.getElementById("MenuNavBar").className = "navbar navbar-expand-lg navbar-light bg-light";
    }
    updateWorldProgressBar();
}
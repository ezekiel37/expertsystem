const data = require('./data.json');
const { Rools, Rule } = require('rools');

function evaluate(diseaseName, facts, data) {
    const i = data.findIndex(d => d.disease === diseaseName);
    const disease = Object.values(data[i]);
    facts = Object.values(facts);
    let matchNo = 0;
    
    for(let i = 1; i < disease.length; ++i) {
        if (Array.isArray(disease[i]) && disease[i].some(symptom => symptom === facts[i])) {
            ++matchNo;
        }
        else if (facts[i] === disease[i]) {
            ++matchNo;
        }
    }
   // let percentage = 80;
   let percentage = matchNo/(disease.length - 1)*100;
    return percentage.toFixed(2);
}

const rules = [];

rules[0] = new Rule({
    name: "Fever",
    when: [
        facts => facts.wheezing === "N",
        facts => facts.cough === "N",
        facts => facts.coughingUpBlood === "N",
        facts => facts.chestPain === "N",
        facts => facts.rapidBreathing === "N",
        facts => facts.rapidHeartbeat === "N",
        facts => facts.fever === "Y"
    ],
    then: facts => {
        facts.disease = "fever";
        facts.percentage = evaluate("fever", facts, data);
    },
});

rules[1] = new Rule({
    name: "Ebola diagnosis",
    when: [
        facts => facts.wheezing === "N",
        facts => facts.cough === "dry",
        facts => facts.coughingUpBlood === "N",
        facts => facts.chestPain === "N",
        facts => facts.rapidBreathing === "N",
        facts => facts.rapidHeartbeat === "Y",
    ],
    then: facts => {
        facts.disease = "ebola";
        facts.percentage = evaluate("ebola", facts, data);
    },
});

rules[2] = new Rule({
    name: "covid-19 diagnosis",
    when: [
        facts => facts.wheezing === "N",
        facts => facts.fever === "Y",
        facts => facts.cough === "dry",
        facts => facts.coughingUpBlood === "Y",
        facts => facts.tiredness === "Y"
    ],
    then: facts => {
        facts.disease = "covid-19";
        facts.percentage = evaluate("covid-19", facts, data);
    },
});

rules[3] = new Rule({
    name: "lassa diagnosis",
    when: [
        facts => facts.smokingHistory === "N",
        facts => facts.cough === "Y",
        facts => facts.vomiting === "Y",
        facts => facts.chestPain === "Y",
        facts => facts.tiredness === "Y",
        facts => facts.tremor === "Y"
    ],
    then: facts => {
        facts.disease = "lassa";
        facts.percentage = evaluate("lassa", facts, data);
    },
});

async function diagnose(facts) {
    const rools = new Rools();
    await rools.register(rules);
    await rools.evaluate(facts);
    return facts;
};

module.exports = { diagnose };
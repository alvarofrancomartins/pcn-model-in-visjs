var container = document.getElementById("mynetwork");

proba = 0.024;
lambda = 7.33;

const options = {
  "autoResize": true,
  "height": '100%',
  "width": '100%',
  "physics": {
    "enabled": true,
    "forceAtlas2Based": {
      "theta": 0.9,
      "gravitationalConstant": -100,
      "centralGravity": 0.01,
      "springConstant": 0.08,
      "springLength": 100,
      "damping": 0.7,
      "avoidOverlap": 0
    },
    "maxVelocity": 50,
    "minVelocity": 0.1,
    "solver": 'forceAtlas2Based',
    "stabilization": { 
      "enabled": false
    },
    "timestep": 0.2,
    "adaptiveTimestep": true,
  },
  "edges": {
    "smooth": false
  },
  "nodes": {
    "shape": "dot",
    "size": 10,
  }
}

function startNewNetwork() {
  a = parseFloat(document.getElementById("recidivism_rate").value);
  b = parseFloat(document.getElementById("beta_parameter").value);

  last_agent_index = 0;
  total_repeated_agents = 0;

  repeated_agent_names = [];
  agent_names = [];

  nodes = new vis.DataSet();
  edges = new vis.DataSet();

  data = {
    nodes: nodes,
    edges: edges,
  };

  return network = new vis.Network(container, data, options);
}

function expoSampling(scale) {
  return Math.round(-scale * Math.log(1.0 - Math.random()));
}

function addCompleteGraph() {
  // calculate the size of the complete graph to enter the network
  var n_new_agents = expoSampling(lambda);

  while (n_new_agents <= 1) {
    var n_new_agents = expoSampling(lambda);
  }

  // get index from new nodes
  var new_agent_names = [];
  for (let n = last_agent_index; n < last_agent_index + n_new_agents; n++) {
    new_agent_names.push(n);
  }
  last_agent_index += n_new_agents;

  size_network = agent_names.length;

  // apply model
  var new_repeated_agents = Math.round(a * (size_network) + b - total_repeated_agents);

  if (new_repeated_agents > 0) {

    var minimo = Math.min(new_repeated_agents, new_agent_names.length);

    for (let i = 0; i < minimo; i++) {

      if ((Math.random() <= proba) && (repeated_agent_names.length > 0)) {

        id_old = repeated_agent_names[Math.floor(Math.random() * repeated_agent_names.length)];

      } else {

        let difference = agent_names.filter(x => !repeated_agent_names.includes(x));

        id_old = difference[Math.floor(Math.random() * difference.length)];

        total_repeated_agents += 1;
      }

      new_agent_names[i] = id_old;
      repeated_agent_names.push(id_old);
    }
  }
  
  for (let i = 0; i < new_agent_names.length; i++) {
    if (!agent_names.includes(new_agent_names[i])){
        agent_names.push(new_agent_names[i])
      }
  }

  // add complete graph to the network
  for (let n = 0; n < new_agent_names.length; n++) {
    nodes.update({
      id: new_agent_names[n]
     })
  }

  for (let i = 0; i < new_agent_names.length; i++) {
    for (let j = i + 1; j < new_agent_names.length; j++) {
      let i_ = new_agent_names[i];
      let j_ = new_agent_names[j];

      if (i_ != j_) {
        edges.update({
          from: i_,
          to: j_
        });
      }
    }
  }

  network.fit();
}

// button dynamics
const numSeconds = 1
document.querySelector('#add_new_scandal').addEventListener('click', (e) => {
  e.target.disabled = true
  setTimeout(() => {
    e.target.disabled = false
  }, numSeconds * 500)
})

function enableAddGraph() {
  document.getElementById("add_new_scandal").disabled = false;
}
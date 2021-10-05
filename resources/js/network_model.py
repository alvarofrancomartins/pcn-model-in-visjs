def generate_net_incremental(tmax = 100, lambda_ = 7.33, a = 0.09, b = -11.5, proba = 0.024091841863485983, sigma = None):
    """
    Generate a corruption network based on our model.
    
    Parameters
    ---------

    tmax : int
           Number iteration steps (default: 100).
    lambda_ : float
           Characteristic number of people per scandal.
    a, b : int
           Parameters defining the number of repeated agents (nr) as a function
           of total number of agents (n): nr = a*n + b (default: 0.09, -11.5).
    proba : float
            Probabilty selecting a repeated agent that was already involved in
            another scandal (default: 0.024091841863485983).

    Returns
    -------
    links_list : list of ndarrays
                 A list of ndarrays where each element is ndarray with the edge
                 list at a particular iteration step.
    """

    t                          = 0
    links                      = []
    links_list                 = []
    agent_names                = set()
    last_agent_index           = 0
    repeated_agent_names       = set()
    total_repeated_agents      = 0

    while t < tmax:
        n_new_agents = int(np.round(np.random.exponential(lambda_)))

        if n_new_agents > 1:

            new_agent_names     = [x for x in np.arange(last_agent_index, last_agent_index + n_new_agents)]
            last_agent_index   += n_new_agents

            new_repeated_agents = int(np.round((a*(len(agent_names)) + b - total_repeated_agents)))

            if new_repeated_agents > 0:
                for i in range(min(new_repeated_agents, len(new_agent_names))):

                    if (np.random.uniform() <= proba) & (len(repeated_agent_names) > 0):
                        #select from repeated_agent_names
                        repeated_agent = np.random.choice(list(repeated_agent_names))
                    else:
                        #select from agent_names
                        repeated_agent = np.random.choice(list(repeated_agent_names^agent_names))
                        total_repeated_agents += 1

                    new_agent_names[i] = repeated_agent
                    repeated_agent_names.add(repeated_agent)

            for agent_ in new_agent_names:
                agent_names.add(agent_)
            
            new_links = np.asarray(list(combinations(new_agent_names, 2))).tolist()

            links      += new_links
            links_list += [np.asarray(links)]
            t          += 1
            
    return links_list
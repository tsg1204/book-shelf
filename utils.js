const Collection = (config) => {
  let models = []

  const init = () => {
    if (config) {
      models.push(config)
    }
  }

  let changeCallback = null

  const add = (item) => {
    if (!_.includes(models, item) || _.isEmpty(models)) {
      models.push(item);

      if (changeCallback) {
        changeCallback()
      }
    }
  }

  const change = (func) => changeCallback = func;

  const getModels = () => {
    return models.map((m) => {
      return m
    })
  }

  const reset = () => {
    models = [];
  }

  init();

  return {
    getModels,
    add,
    change,
    reset
  }
};

const Model = (config) => {
  const attributes = {}

  let changeCallback = null

  const init = () => Object.assign(attributes, config);

  const set = (prop, value) => {
    const tempObj = Object.assign({}, attributes)

    tempObj[prop] = value

    if (!_.isEqual(attributes, tempObj)) {
      attributes[prop] = value

      if (changeCallback) {
        changeCallback()
      }
    }
  };

  const get = (prop) => attributes[prop];
  const change = (func) => changeCallback = func;

  init()

  return {
    set,
    get,
    change
  }
};

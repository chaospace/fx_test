const _ = {};
_.map = (list, iteratee) => {
  let new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    new_list.push(iteratee(list[i], i, list));
  }
  return new_list;
};

_.filter = (list, predicate) => {
  let new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) new_list.push(list[i]);
  }
  return new_list;
};

_.find = (list, predicate) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return list[i];
  }
};

_.identity = v => v;

_.some = list => !!_.find(list, _.identity);
_.every = list => _.filter(list, _.identity).length == list.length;

_.findIndex = (list, predicate) => {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return i;
  }
  return -1;
};

_.positive = list => _.find(list, _.identity);

function compose() {
  let args = arguments;
  //console.log("arguments", arguments);
  let start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

let greet = function (name) {
  return "hi : " + name;
};
let upperCase = function (statement) {
  return statement.toUpperCase() + "!";
};
let welcome = compose(greet, upperCase);

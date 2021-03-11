// queryCreator is a function that takes in an id (int) and data (json object) and returns a dynamic "update" query string

exports.queryCreator = (id, data) => {
  const query = ['UPDATE hackers SET'];

  const set = [];
  const parameters = [];

  Object.keys(data).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')');
    parameters.push(data[key]);
  });

  query.push(set.join(', '));
  query.push('WHERE id = ' + id);
  query.push('returning *');

  return {
    query: query.join(' '),
    parameters,
  };
};

export default {
  "type": "Rank",
  "metadata": {"modifies": true},
  "params": [
    { "name": "field", "type": "field", "required": true },
    { "name": "normalize", "type": "boolean", "default": false },
    { "name": "as", "type": "string", "default": "rank" }
  ]
};

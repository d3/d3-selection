var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

export default function(string) {
  return string.replace(requoteRe, "\\$&");
};

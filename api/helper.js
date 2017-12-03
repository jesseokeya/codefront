let evaluateBlogContent = (data) => {
  const contents = data.body;
  if (contents) {
    const splitContents = contents.split('\n');
    for (let i in splitContents) {
      if (splitContents[i].length === 0) {
        splitContents.splice(i, 1);
      }
    }
    const requiredData = {
      title: data.title,
      heading: data.heading,
      subheading: data.subheading,
      body: splitContents,
      date: data.date,
      author: data.author,
      comments: data.comments,
      images: data.images,
      meta: data.meta
    }
    return requiredData;
  }
}

let splitAboutMe = (aboutMe) => {
  const splitContents = aboutMe[0].description.split('\n');
  for (let i in splitContents) {
    if (splitContents[i].length === 0) {
      splitContents.splice(i, 1);
    }
  }
  return splitContents;
}

module.exports = {
  evaluateBlogContent: evaluateBlogContent,
  splitAboutMe: splitAboutMe
}

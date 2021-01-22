export default function getImageUrl(
    category,
    variant,
    imageName,
  ) {
      return `${__myapp.env.CDN_URL}/media/cache/${category}/${variant}/${imageName}`;
  }
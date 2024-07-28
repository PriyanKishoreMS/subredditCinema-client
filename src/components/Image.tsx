import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	fallback?: string;
}

const Image: React.FC<ImageProps> = ({
	src,
	alt,
	fallback = "?",
	...props
}) => {
	const [imageSrc, setImageSrc] = React.useState(src);
	const [error, setError] = React.useState(false);

	React.useEffect(() => {
		setImageSrc(src);
		setError(false);
	}, [src]);

	const handleError = () => {
		setError(true);
	};

	if (error) {
		return <div>{fallback}</div>;
	}

	return <img src={imageSrc} alt={alt} onError={handleError} {...props} />;
};

export default Image;

/**
 * Checks if given array is unique or not
 * @param {Array} arr array of strings or numbers
 * @returns boolean
 */
module.exports.isUniqueArray = (arr = []) => {
	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
		const elArr = arr.filter((el) => el === element);
		if (elArr.length > 1) return false;
	}
	return true;
};

export const coordToIdx = (width, height, i, j) => {
	// return -1 if an invalid (i,j) coordinate given
	if (i < 0 || i >= height || j < 0 || j >= width) {
		return -1
	} else {
		return 4*(i*width + j)
	}
}

export const neighborIndices = (width, height, i, j) => {
	const indices = []
	for (let iOffset = -1; iOffset <= 1; iOffset++) {
		for (let jOffset = -1; jOffset <= 1; jOffset++) {
			indices.push(coordToIdx(width, height, i + iOffset, j + jOffset))
		}
	}
	return indices.filter((idx) => idx >= 0)
}
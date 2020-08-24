import { coordToIdx, neighborIndices } from './indexUtils'

export const SCALE = {
	0.0: [255, 0, 0, 255],
	0.2: [255, 255, 0, 255],
	0.4: [0, 255, 0, 255],
	0.6: [0, 255, 255, 255],
	0.8: [0, 0, 255, 255],
	1.0: [255, 0, 255, 255]
}

export const calcColor = (value) => {

	const temperature = value * 0.01
	const vals = Object.keys(SCALE)

	let upper = 1.0 
	let upperElem = SCALE[upper]
	let lower = 0.0
	let lowerElem = SCALE[lower]

	for (let i = 0; i < vals.length; i++) {
		if (vals[i] <= upper && vals[i] >= temperature ) {
			upper = vals[i]
			upperElem = SCALE[upper]
		}
		if (vals[i] >= lower && vals[i] <= temperature ) {
			lower = vals[i]
			lowerElem = SCALE[lower]
		}
	}

	let r = 0
	let g = 0
	let b = 0
	let a = 255

	if (upper === lower) {
		r = upperElem[0]
		g = upperElem[1]
		b = upperElem[2]
		a = upperElem[3]
	} else {
		const ratio = (temperature - lower)/(1.0*(upper - lower))
		r = Math.round((upperElem[0] - lowerElem[0])*ratio + lowerElem[0])
		g = Math.round((upperElem[1] - lowerElem[1])*ratio + lowerElem[1])
		b = Math.round((upperElem[2] - lowerElem[2])*ratio + lowerElem[2])
		a = Math.round((upperElem[3] - lowerElem[3])*ratio + lowerElem[3])
	}

	return {
		temperature: temperature,
		color: [r, g, b, a]
	}
}

export const colorPixel = (width, height, y, x, imageData, color) => {
	const idx = coordToIdx(width, height, y, x)
	for (let offset = 0; offset < 4; offset++) {
		imageData.data[idx + offset] = color[offset]
	}
}

export const colorSpot = (width, height, y, x, imageData, color) => {
	const indices = neighborIndices(width, height, y, x)
	indices.forEach((idx) => {
		for (let offset = 0; offset < 4; offset++) {
			imageData.data[idx + offset] = color[offset]
		}
	})
}

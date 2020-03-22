module.exports = {
	// _turbo:  (item) => {
	// 	// console.log(item)
	// 	let descriptionMatch = item['detailed_description'].match(/turbo/ig) == null ? true : false
	// 	let itemMatch = item['info'].match(/turbo/ig) == null ? true : false
	// 	return (itemMatch || descriptionMatch)
	// },
	_model: (item) => {
		// Filter out chaff
		item['_info'] = item['info'].replace(
			/(911|997|991|20\d\d)(\.\d)?|(coupe|cab(riolet)?)|FS:|porsche/gi, '').trim()
		// console.log(item['_info'])
		// 911 models: 
		// C2 C2S C2Cab C2SCab C4 C4S C4Cab C4SCab Targa TargaS Turbo TurboS TurboCab TurboSCab
		// GT3 GT3RS GT3RS4.0 GT2RS
		if (item['model'] == '911') {
			return (
				item['info'].match(/targa.*4s/i) ? 'Targa 4S' :
				item['info'].match(/targa.*4/i) ? 'Targa 4' :
				item['info'].match(/gts/i) ? 'Carrera GTS' :
				item['info'].match(/turbo s|TTS/i) ? 'Turbo S' :
				item['info'].match(/turbo|\bTT\b/i) ? 'Turbo' :
				item['info'].match(/gt3.*rs/i) ? 'GT3 RS' :
				item['info'].match(/gt3/i) ? 'GT3' :
				item['info'].match(/gt2/i) ? 'GT2 RS' :
				item['info'].match(/4s\b/i) ? 'Carrera 4S' :
				item['info'].match(/S\b/) ? 'Carrera S' :
				item['info'].match(/4\b/i) ? 'Carrera 4' :
				item['info'].match(/carrera|c2|base/i) ? 'Carrera' :
				'unknown'
			)
		}
		if (item['model'] == 'Cayman') {
			return (
				item['info'].match(/cayman r/i) ? 'Cayman R' :
				item['info'].match(/cayman s/i) ? 'Cayman S' :
				'Cayman'
			)
		}
		else
			'Unknown'
	},
	_info: (item) => item['info'].replace(/,/g, '')


}
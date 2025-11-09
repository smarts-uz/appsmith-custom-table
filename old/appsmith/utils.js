export default {
	rowActions: () => ( // optional
		[
			{
				title: '💻Korish',
				onClick: 'onClick'
			},
			{
				title: '➕Qoshish',
				onClick: 'onKomol'
			},
			{
				title: '💵Tolov',
				onClick: 'onClick'
			},
			{
				title: '🔃Qaytarilgan mahsulotlar',
				onClick: 'onClick'
			},
			{
				title: '🫰Qaytarish',
				onClick: 'onClick'
			},
			{
				title: '✏️Tahrirlash',
				onClick: 'onClick'
			},
			{
				title: '🏁Tugatish',
				onClick: 'onClick'
			}
		]
	),

	actionColumnConfig: () => ({
		enable: true,
		pin: 'right',
		size: 'sm',
	}),

	rowIndexColumn: () => ({
		enable: true,
		size: 'xs'  // 'xs', 'sm', 'md', 'lg'
	}),

	rowStyleRules: () => ([
		{
			"column": "id",
			"operator": ">",
			"value": 44735,
			"color": "#ffcccc"
		}
	]),

	rowSelectionAction: () => "onFichiFici", // optional

	schema: () => ({
		id: { type: "id", title: "ID", sort: true, size: "md" },
		guid: { type: "text", title: "GUID" },
		role: { type: "text", title: "Rol" },
		name: { type: "text", title: "Ism", filter: true },
		email: { type: "text", title: "Email", filter: true },
		phone: { type: "phone", title: "Telefon" },
		sms_code: { type: "text", title: "SMS kodi" },
		sms_created_at: { type: "date", title: "SMS yaratilgan vaqti" },
		last_name: { type: "text", title: "Familiya" },
		middle_name: { type: "text", title: "Otasining ismi" },
		gender: { type: "text", title: "Jinsi" },
		birth_date: { type: "date", title: "Tug‘ilgan sana" },
		bio: { type: "text", title: "Bio" },
		balance: { type: "number", title: "Balans" },
		created_at: { type: "date", title: "Yaratilgan vaqti" },
		updated_at: { type: "date", title: "Yangilangan vaqti" },
		deleted_at: { type: "date", title: "O‘chirilgan vaqti" },
		created_by: { type: "text", title: "Yaratgan" },
		updated_by: { type: "text", title: "Yangilagan" },
		deleted_by: { type: "text", title: "O‘chirgan" },
		language: { type: "text", title: "Til" },
		phone_verified: { type: "bool", title: "Telefon tasdiqlangan" }
	}),

	url: () => 'https://nagcsbpmekppolegnisf.supabase.co/rest/v1/user?select=*',

	tableHeight: () => '700px',

	headers: () => ({
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "true",
		"apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZ2NzYnBtZWtwcG9sZWduaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mzg5NjcsImV4cCI6MjA2NDAxNDk2N30.L2hUdOf2VZdyTDRisU9vgo3g_ThsYNsREsu0IWKO6Qw"
	}),


	bodyData: () => ({ v_vendor_id: 230 }),

	dataKey: () => '',

	colors: () => ({
		oddRowColor: '#F0F4FF',        // Soft bluish for odd rows
		evenRowColor: '#FAFAFA',       // Light gray for even rows
		rowHoverColor: '#DCEBFF',
		borderColor: '#CBD5E1'
	}),

	showBorder: () => true,

	pagination: () => ({
		enable: false,
		pageSize: 25
	})
} 
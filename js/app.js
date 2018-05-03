$(function(){
	/* 如果本地存储没有缓存出勤记录，则初始化缓存。 */
	if (!localStorage.attendance) {
		console.log('Creating attendance records...');
		function getRandom() {
			return (Math.random() >= 0.5);
		}
		var nameColumns = $('tbody .name-col'),
				attendance = {};
		nameColumns.each(function(){
			var name = this.innerText;
			attendance[name]=[];
			for(var i=0;i<=11;i++) {
				attendance[name].push(getRandom());
			}

		});
		console.log(nameColumns);
		localStorage.attendance=JSON.stringify(attendance);
		console.log(attendance);
	}
	
	var model={
		students:[
		{name:'Slappy the Frog',dayChecks:[],daysMissed:0},
		{name:'Lilly the Lizard',dayChecks:[],daysMissed:0},
		{name:'Paulrus the Walrus',dayChecks:[],daysMissed:0},
		{name:'Gregory the Goat',dayChecks:[],daysMissed:0},
		{name:'Adam the Anaconda',dayChecks:[],daysMissed:0}
		],
		init:function() {
			var attendance=JSON.parse(localStorage.attendance);
			$.each(model.students,function(index,student){
				var dayRecords=attendance[student.name];
				var daysMissed=0;
				$.each(dayRecords,function(index,day){
					student.dayChecks.push(day);
					if(!day) {
						daysMissed++;
					}
				});
				student.daysMissed=daysMissed;
			});
		},
		updateAttendInfo:function(name,attend,index) {
			$.each(model.students,function(serialNum,student) {
				if(student.name===name) {
					student.dayChecks[index]=attend;
					if(attend) {
						student.daysMissed--;
					}
					else {
						student.daysMissed++;
					}
				}
			});
		}
	};
	var octopus={
		init:function() {
			model.init();
			view.init();
		},
		updateAttendInfo:function(name,attend,index){
			model.updateAttendInfo(name,attend,index);
			var attendance=JSON.parse(localStorage.attendance);
			attendance[name][index]=attend;
			localStorage.attendance=JSON.stringify(attendance);
		},
		getAttendsInfo:function() {
			return model.students;
		}
	};
	var view={
		init:function() {
			this.studentTemplate = $('script[data-template="student"]').html();
			this.tbody=$('tbody');
			this.attendColTemplate = $('script[data-template="attend-col"]').html();
			this.tbody.on("click",".attend-col>input",function(){
				var name=$(this).parents('.student').children('.name-col').text();
				var attend=this.checked;
				var index=$(this).parent('.attend-col').data().id;
				octopus.updateAttendInfo(name,attend,index);
				view.render();
			});
			this.render();
		},
		render:function() {
			var students=octopus.getAttendsInfo();
			var that=this;
			that.tbody.html('');
			$.each(students,function(index,student){
				var $studentRow=$(that.studentTemplate);
				var $missedCol=$studentRow.children('.missed-col');
				
				$studentRow.children('.name-col').text(student.name);
				$missedCol.text(student.daysMissed);
				$.each(student.dayChecks,function(serialNum,day) {
					var attendCol=that.attendColTemplate.replace(/{{id}}/g,serialNum);
					var $attendCol=$(attendCol);
					$attendCol.children("input").attr("checked",day);
					$attendCol.insertBefore($missedCol);
				});
				that.tbody.append($studentRow);
			})
		}
	};
	octopus.init();
});

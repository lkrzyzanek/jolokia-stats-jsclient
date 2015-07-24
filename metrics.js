Metrics = function () {
	var defaultParams = function () {
		return {
			username: $("#username").val(),
			password: $("#password").val()
		}
	};
	this.defaultParams = defaultParams;

	var c;
	var client = function () {
		if (!c) {
			console.log("Create new client");
			$("#jolokiainfo").text("Connecting ...");
			c = Jolokia($("#url").val());
			var params = {
				success: function (resp) {
					$("#jolokiainfo").text("Jolokia version: " + resp.value.agent);
				}
			};

			c.request({
				type: "version"
			}, jQuery.extend(true, params, defaultParams()));
		}
		return c;
	};
	this.client = client;

	var init = function () {
		$("#connect").click(function() {
			c = null;
			client();
		});
		$("#memory").click(memory);
		$("#cluster").click(cluster);
		$("#threadDump").click(threadDump);
		$("#gc").click(gc);
	};
	this.init = init;


	var dt;
	var createDataTable = function (params) {
		if (dt) {
			dt.destroy();
			$("#result").remove();
		}
		var table = $('<table id="result"></table>');
		$('#resultArea').append(table);
		dt = $('#result').DataTable(params);
		return dt;
	};

	var memory = function () {
		var params = {
			success: function (resp) {
				var result = createDataTable(
					{
						"columns": [
							{"title": "Property Name"},
							{"title": "Value"}
						],
						"autoWidth": false,
						"paging": false,
						"info": false,
						"ordering": false
					}
				);
				result.row.add(["Init", (resp.value.init / 1024) + " MB"]);
				result.row.add(["Max", (resp.value.max / 1024) + " MB"]);
				result.row.add(["Used", (resp.value.used / 1024) + " MB"]);
				result.draw();
			}
		};

		client().request({
			type: "read",
			mbean: "java.lang:type=Memory",
			attribute: "HeapMemoryUsage"
		}, jQuery.extend(true, params, defaultParams()));
	};
	this.memory = memory;

	var gc = function () {
		var params = {
			success: function () {
				var result = createDataTable(
					{
						"columns": [
							{"title": "Status"}
						],
						"autoWidth": false,
						"data": [["Performed"]],
						"paging": false,
						"info": false,
						"ordering": false
					}
				);
			}
		};
		client().execute("java.lang:type=Memory", "gc", jQuery.extend(true, params, defaultParams()));
	};
	this.gc = gc;

	/*
	 * Cluster nodes info
	 */
	var cluster = function () {
		var params = {
			success: function (resp) {
				createDataTable(
					{
						"columns": [
							{"title": "Property Name"},
							{"title": "Value"}
						],
						"autoWidth": false,
						"data": [["Cluster nodes", resp.value]],
						"paging": false,
						"info": false,
						"ordering": false
					}
				);
			}
		};

		client().request({
			type: "read",
			mbean: "jboss.infinispan:cluster=\"web\",type=channel",
			attribute: "View"
		}, jQuery.extend(true, params, defaultParams()));
	};
	this.cluster = cluster;


	/*
	 * Cluster nodes info
	 */
	var threadDump = function () {
		var params = {
			success: function (resp) {
				var result = createDataTable(
					{
						"columns": [
							{"title": "Name"},
							{"title": "State"},
							{"title": "Blocked"},
							{"title": "Waited"},
							{"title": "Stacktrace"}
						],
						"autoWidth": false,
						"paging": false,
						aaSorting: []
					}
				);

				$.each(resp.value, function (index, row) {
					var stackTrace = "";
					$.each(row.stackTrace, function (index, r) {
						var lineNumber = "";
						if (r.lineNumber > 0) {
							lineNumber = ":" + r.lineNumber;

						}
						stackTrace += (r.className + "(" + r.fileName + lineNumber + ")") + "<br/>";
					});
					result.row.add([
						row.threadName,
						row.threadState,
						row.blockedCount,
						row.waitedCount,
						stackTrace]);
				});
				result.draw();
			}
		};

		client().request({
			type: "exec",
			mbean: "java.lang:type=Threading",
			operation: "dumpAllThreads",
			arguments: ["true", "true"]
		}, jQuery.extend(true, params, defaultParams()));
	};
	this.threadDump = threadDump;

};

metrics = new Metrics();
metrics.init();

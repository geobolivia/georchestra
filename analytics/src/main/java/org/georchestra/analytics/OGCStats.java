package org.georchestra.analytics;

import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.georchestra.analytics.model.OGCStatsModel;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * ogc layers controller
 * 
 * @author: fgravin
 */

@Controller
public class OGCStats extends AbstractApplication {

	protected OGCStats(OGCStatsModel model) {
		this.model = model;
	}

	private OGCStatsModel model;
	
	private final String csvLayers= "OgcLayers";
	private final String csvUsers= "OgcUsers";
	private final String csvGroups= "OgcGroups";
	
	@RequestMapping(method = RequestMethod.GET, value = "/ogc/layers")
	public void getOGCLayersStats(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		getStats(request, response, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getLayersStats(month, year, start, limit, sort, filter);
			}
		});	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/ogc/users")
	public void getOGCUsersStats(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		getStats(request, response, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getUsersStats(month, year, start, limit, sort, filter);
			}
		});	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/ogc/groups")
	public void getOGCGroupsStats(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		getStats(request, response, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getGroupsStats(month, year, start, limit, sort, filter);
			}
		});	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/export/ogclayers")
	public void exportLayers(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		exportCSV(request, response, csvLayers, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getLayersStats(month, year, 0, Integer.MAX_VALUE, sort, filter);
			}
		});	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/export/ogcusers")
	public void exportUsers(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		exportCSV(request, response, csvUsers, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getUsersStats(month, year, 0, Integer.MAX_VALUE, sort, filter);
			}
		});	
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/export/ogcgroups")
	public void exportGroups(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		exportCSV(request, response, csvGroups, new StrategyController(){
			protected JSONObject process() throws SQLException, JSONException {
				return model.getGroupsStats(month, year, 0, Integer.MAX_VALUE, sort, filter);
			}
		});	
	}
}
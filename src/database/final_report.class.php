<?php
/**
 * final_report.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * final_report: record
 */
class final_report extends \cenozo\database\record
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' ); 

    // convert reqn identifier to reqn_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=([0-9]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, sprintf( 'reqn_id=%d', $db_reqn->id ), $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @access public
   */
  public function generate_pdf_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );

    // get the data application
    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Final Report' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Final Report PDF form.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );

    $db_reqn = $this->get_reqn();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();
    $db_reqn_version = $db_reqn->get_current_reqn_version();
    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->version // TODO: make sure version is in the PDF
    );

    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $db_reqn_version->applicant_affiliation ) )
      $data['applicant_affiliation'] = $db_reqn_version->applicant_affiliation;
    if( !is_null( $db_reqn_version->applicant_address ) )
      $data['applicant_address'] = $db_reqn_version->applicant_address;
    if( !is_null( $db_reqn_version->applicant_phone ) ) $data['applicant_phone'] = $db_reqn_version->applicant_phone;
    $data['applicant_email'] = $db_user->email;
    if( !is_null( $db_reqn_version->title ) ) $data['title'] = $db_reqn_version->title;
    if( !is_null( $db_reqn_version->lay_summary ) ) $data['lay_summary'] = $db_reqn_version->lay_summary;
    if( !is_null( $this->activities ) || !is_null( $this->findings ) || !is_null( $this->outcomes ) )
    {
      $data['accomplishments'] = $accomplishments = sprintf(
        "1) %s\n\n2) %s\n\n3) %s",
        $this->activities,
        $this->findings,
        $this->outcomes
      );
    }
    if( !is_null( $db_trainee_user ) ) $data['trainee_name'] =
      sprintf( '%s %s', $db_trainee_user->first_name, $db_trainee_user->last_name );
    if( !is_null( $this->thesis_title ) ) $data['thesis_title'] = $this->thesis_title;
    if( !is_null( $this->thesis_status ) ) $data['thesis_status'] = $this->thesis_status;
    if( !is_null( $this->impact ) ) $data['impact'] = $this->impact;
    if( !is_null( $this->opportunities ) ) $data['opportunities'] = $this->opportunities;
    if( !is_null( $this->dissemination ) ) $data['dissemination'] = $this->dissemination;
    $data['signature_name'] = $data['applicant_name'];
    $data['signature_date'] = util::get_datetime_object()->format( 'd-m-Y' );

    $production_sel = lib::create( 'database\select' );
    $production_sel->add_column( 'production_type_id' );
    $production_sel->add_column( 'detail' );
    $production_mod = lib::create( 'database\modifier' );
    $production_mod->order( 'production_type_id', 'id' );

    // the form supports a limited number of production for each type
    $production_limit_list = array( 1=>5, 2=>5, 3=>3, 4=>3, 5=>2, 6=>2, 7=>2 );

    $last_production_type_id = NULL;
    $count = NULL;
    foreach( $this->get_production_list( $production_sel, $production_mod ) as $production )
    {
      $count = $last_production_type_id == $production['production_type_id'] ? $count+1 : 1;
      if( $count <= $production_limit_list[$production['production_type_id']] )
        $data[sprintf( 'production_%d_%d', $production['production_type_id'], $count )] = $production['detail'];

      $last_production_type_id = $production['production_type_id'];
    }

    $pdf_writer->fill_form( $data );
    $filename = sprintf( '%s/%s.pdf', FINAL_REPORT_PATH, $this->id );
    if( !$pdf_writer->save( $filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $this->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    $production_class_name = lib::get_class_name( 'database\production' );

    // get the two newest versions
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'reqn_id', '=', $this->reqn_id );
    $version_mod->order( 'version', true );
    $version_mod->limit( 2 );
    $final_report_list = static::select_objects( $version_mod );
    if( 2 != count( $final_report_list ) ) return true;

    $db_last_final_report = $final_report_list[1];

    // check all column values except for id, version, datetime and timestamps
    $ignore_columns = array( 'id', 'version', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_final_report->$column )
        return true;

    // now check production records
    foreach( $this->get_production_object_list() as $db_production )
    {
      // TODO: implement
      /*
      $db_last_production = $production_class_name::get_unique_record(
        array( 'final_report_id', 'rank' ),
        array( $db_last_final_report->id, $db_production->rank )
      );
      if( is_null( $db_last_production ) ) return true;

      // check all column values except for id, final_report_id and timestamps
      $ignore_columns = array( 'id', 'final_report_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_production->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_production->$column != $db_last_production->$column )
          return true;
      */
    }

    // if we get here then everything is identical
    return false;
  }
}

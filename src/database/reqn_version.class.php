<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn_version extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    parent::save();

    // delete files if they are being set to null
    if( is_null( $this->funding_filename ) )
    {
      $filename = $this->get_filename( 'funding' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->ethics_filename ) )
    {
      $filename = $this->get_filename( 'ethics' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->data_sharing_filename ) )
    {
      $filename = $this->get_filename( 'data_sharing' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->agreement_filename ) )
    {
      $filename = $this->get_filename( 'agreement' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->funding_filename ) ) $file_list[] = $this->get_filename( 'funding' );
    if( !is_null( $this->ethics_filename ) ) $file_list[] = $this->get_filename( 'ethics' );
    if( !is_null( $this->data_sharing_filename ) ) $file_list[] = $this->get_filename( 'data_sharing' );
    if( !is_null( $this->agreement_filename ) ) $file_list[] = $this->get_filename( 'agreement' );

    parent::delete();

    foreach( $file_list as $file ) unlink( $file );
  }

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    $coapplicant_class_name = lib::get_class_name( 'database\coapplicant' );
    $reference_class_name = lib::get_class_name( 'database\reference' );
    $reqn_version_data_option_class_name = lib::get_class_name( 'database\reqn_version_data_option' );

    // get the two newest versions
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'reqn_id', '=', $this->reqn_id );
    $version_mod->order( 'amendment', true );
    $version_mod->order( 'version', true );
    $version_mod->limit( 2 );
    $reqn_version_list = static::select_objects( $version_mod );
    if( 2 != count( $reqn_version_list ) ) return true;

    $db_last_reqn_version = $reqn_version_list[1];

    // check all column values except for id, version, datetime and timestamps
    $ignore_columns = array( 'id', 'amendment', 'version', 'datetime', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_reqn_version->$column )
        return true;

    // now check coapplicant records
    foreach( $this->get_coapplicant_object_list() as $db_coapplicant )
    {
      $db_last_coapplicant = $coapplicant_class_name::get_unique_record(
        array( 'reqn_version_id', 'name' ),
        array( $db_last_reqn_version->id, $db_coapplicant->name )
      );
      if( is_null( $db_last_coapplicant ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_coapplicant->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_coapplicant->$column != $db_last_coapplicant->$column )
          return true;
    }

    // now check reference records
    foreach( $this->get_reference_object_list() as $db_reference )
    {
      $db_last_reference = $reference_class_name::get_unique_record(
        array( 'reqn_version_id', 'rank' ),
        array( $db_last_reqn_version->id, $db_reference->rank )
      );
      if( is_null( $db_last_reference ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_reference->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_reference->$column != $db_last_reference->$column )
          return true;
    }

    // see if there is a different number of data options
    if( $this->get_reqn_version_data_option_count() != $db_last_reqn_version->get_reqn_version_data_option_count() )
      return true;

    // now check reqn_version_data_option records
    foreach( $this->get_reqn_version_data_option_object_list() as $db_rvdo )
    {
      $db_last_rvdo = $reqn_version_data_option_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_option_id', 'study_phase_id' ),
        array( $db_last_reqn_version->id, $db_rvdo->data_option_id, $db_rvdo->study_phase_id )
      );
      if( is_null( $db_last_rvdo ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_rvdo->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_rvdo->$column != $db_last_rvdo->$column )
          return true;
    }

    // do the same check but from the last version instead
    foreach( $db_last_reqn_version->get_reqn_version_data_option_object_list() as $db_rvdo )
    {
      $db_last_rvdo = $reqn_version_data_option_class_name::get_unique_record(
        array( 'reqn_version_id', 'data_option_id', 'study_phase_id' ),
        array( $this->id, $db_rvdo->data_option_id, $db_rvdo->study_phase_id )
      );
      if( is_null( $db_last_rvdo ) ) return true;

      // check all column values except for id, reqn_version_id and timestamps
      $ignore_columns = array( 'id', 'reqn_version_id', 'update_timestamp', 'create_timestamp' );
      foreach( $db_rvdo->get_column_names() as $column )
        if( !in_array( $column, $ignore_columns ) && $db_rvdo->$column != $db_last_rvdo->$column )
          return true;
    }

    // if we get here then everything is identical
    return false;
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'agreement', 'funding', 'ethics', 'data_sharing' or 'instruction'
   * @return string
   * @access public
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'funding' == $type ) $directory = FUNDING_LETTER_PATH;
    else if( 'ethics' == $type ) $directory = ETHICS_LETTER_PATH;
    else if( 'data_sharing' == $type ) $directory = DATA_SHARING_LETTER_PATH;
    else if( 'agreement' == $type ) $directory = AGREEMENT_LETTER_PATH;
    else if( 'instruction' == $type ) $directory = INSTRUCTION_FILE_PATH;
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
  }

  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    // convert reqn identifier to reqn_version_id (always using the current version)
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=(.+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, $db_reqn->get_current_reqn_version()->id, $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Generates all PDF forms of the reqn version (overwritting the previous versions)
   * 
   * This includes the application, checklist and application+checklist PDF files
   * @access public
   */
  public function generate_pdf_forms()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );
    $db_reqn = $this->get_reqn();
    $db_user = $db_reqn->get_user();
    $db_graduate_user = $db_reqn->get_graduate_user();

    // generate the application form
    $data = array( 'identifier' => $db_reqn->identifier );
    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    $application_filename = sprintf( '%s/%s.pdf', DATA_APPLICATION_PATH, $this->id );

    if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
    if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
    if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
    if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
    $data['applicant_email'] = $db_user->email;
    // only show graduate details if there is a graduate user
    if( !is_null( $db_graduate_user ) )
    {
      $data['graduate_name'] = sprintf( '%s %s', $db_graduate_user->first_name, $db_graduate_user->last_name );
      if( !is_null( $this->graduate_program ) ) $data['graduate_program'] = $this->graduate_program;
      if( !is_null( $this->graduate_institution ) ) $data['graduate_institution'] = $this->graduate_institution;
      if( !is_null( $this->graduate_address ) ) $data['graduate_address'] = $this->graduate_address;
      if( !is_null( $this->graduate_phone ) ) $data['graduate_phone'] = $this->graduate_phone;
      if( !is_null( $db_graduate_user ) ) $data['graduate_email'] = $db_graduate_user->email;
      if( !is_null( $this->waiver ) )
      {
        if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
        else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
      }
    }
    if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
    if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
    if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
    if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
    $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
    if( !is_null( $this->background ) ) $data['background'] = $this->background;
    if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
    if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
    if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

    if( !is_null( $this->funding ) )
    {
      if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
      else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
      else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
    }
    if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
    if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
    if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics;
    if( !is_null( $this->ethics_date ) && !$data['ethics'] )
      $data['ethics_date'] = $this->ethics_date->format( 'Y-m-d' );
    $data['signature_applicant_name'] = $data['applicant_name'];

    foreach( $this->get_coapplicant_list() as $index => $coapplicant )
    {
      $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
      $data[sprintf( 'coapplicant%d_position', $index+1 )] =
        sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
      $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
      $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
    }

    $reference_list = array();
    $reference_sel = lib::create( 'database\select' );
    $reference_sel->add_column( 'rank' );
    $reference_sel->add_column( 'reference' );
    $reference_mod = lib::create( 'database\modifier' );
    $reference_mod->order( 'rank' );
    foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $reference )
      $reference_list[] = sprintf( '%s.  %s', $reference['rank'], $reference['reference'] );
    $data['references'] = implode( "\n", $reference_list );

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF application form since there is no active PDF template.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );
    $pdf_writer->fill_form( $data );
    if( !$pdf_writer->save( $application_filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $application_filename,
          $db_reqn->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }

    // now generate the checklist form
    $data = array( 'identifier' => $db_reqn->identifier );
    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Checklist' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    $checklist_filename = sprintf( '%s/%s.pdf', DATA_CHECKLIST_PATH, $this->id );

    if( $this->comprehensive ) $data['comprehensive'] = 'Yes';
    if( $this->tracking ) $data['tracking'] = 'Yes';
    if( $this->longitudinal ) $data['longitudinal'] = 'Yes';
    if( !is_null( $this->last_identifier ) ) $data['last_identifier'] = $this->last_identifier;
    if( !is_null( $this->part2_a_comment ) ) $data['part2_a_comment'] = $this->part2_a_comment;
    if( !is_null( $this->part2_b_comment ) ) $data['part2_b_comment'] = $this->part2_b_comment;
    if( !is_null( $this->part2_c_comment ) ) $data['part2_c_comment'] = $this->part2_c_comment;
    if( !is_null( $this->part2_d_comment ) ) $data['part2_d_comment'] = $this->part2_d_comment;
    if( $this->cimt ) $data['cimt'] = 'Yes';
    if( $this->dxa ) $data['dxa'] = 'Yes';
    if( $this->ecg ) $data['ecg'] = 'Yes';
    if( $this->retinal ) $data['retinal'] = 'Yes';
    if( $this->spirometry ) $data['spirometry'] = 'Yes';
    if( $this->tonometry ) $data['tonometry'] = 'Yes';

    $additional_data_justification_list = array();
    if( !is_null( $this->cimt_justification ) ) $additional_data_justification_list[] = $this->cimt_justification;
    if( !is_null( $this->dxa_justification ) ) $additional_data_justification_list[] = $this->dxa_justification;
    if( !is_null( $this->ecg_justification ) ) $additional_data_justification_list[] = $this->ecg_justification;
    if( !is_null( $this->retinal_justification ) ) $additional_data_justification_list[] = $this->retinal_justification;
    if( !is_null( $this->spirometry_justification ) ) $additional_data_justification_list[] = $this->spirometry_justification;
    if( !is_null( $this->tonometry_justification ) ) $additional_data_justification_list[] = $this->tonometry_justification;
    if( 0 < count( $additional_data_justification_list ) )
      $data['additional_data_justification'] = implode( "\n", $additional_data_justification_list );

    if( $this->fsa ) $data['fsa'] = 'Yes';
    if( $this->csd ) $data['csd'] = 'Yes';

    $geographic_location_justification_list = array();
    if( !is_null( $this->fsa_justification ) ) $geographic_location_justification_list[] = $this->fsa_justification;
    if( !is_null( $this->csd_justification ) ) $geographic_location_justification_list[] = $this->csd_justification;
    if( 0 < count( $geographic_location_justification_list ) )
      $data['geographic_location_justification'] = implode( "\n", $geographic_location_justification_list );

    $reqn_version_data_option_list = array();
    $reqn_version_data_option_sel = lib::create( 'database\select' );
    $reqn_version_data_option_sel->add_column( 'data_option_id' );
    $reqn_version_data_option_sel->add_table_column( 'study_phase', 'code' );
    $reqn_version_data_option_mod = lib::create( 'database\modifier' );
    $reqn_version_data_option_mod->join( 'study_phase', 'reqn_version_data_option.study_phase_id', 'study_phase.id' );
    $list = $this->get_reqn_version_data_option_list( $reqn_version_data_option_sel, $reqn_version_data_option_mod );
    foreach( $list as $reqn_version_data_option )
      $data[sprintf( 'data_option_%s_%s', $reqn_version_data_option['data_option_id'], $reqn_version_data_option['code'] )] = 'Yes';

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF checklist form since there is no active PDF template.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );
    $pdf_writer->fill_form( $data );
    if( !$pdf_writer->save( $checklist_filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $checklist_filename,
          $db_reqn->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }

    // now generate the combined PDF form containing both application and checklist
    $application_and_checklist_filename = sprintf( '%s/%s.pdf', DATA_APPLICATION_AND_CHECKLIST_PATH, $this->id );
    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->merge( array( $application_filename, $checklist_filename ) );
    if( !$pdf_writer->save( $application_and_checklist_filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $application_and_checklist_filename,
          $db_reqn->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }
}
